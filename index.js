const events = require("events");
const fs = require("fs");
const path = require("path");
const RCON = require("rcon");
const YAML = require("yaml");

const Mirai = require("node-mirai-sdk");
const { Plain, At } = Mirai.MessageComponent;
const { Friend, Group, Temp } = Mirai.Target;

const TEXTS = require(path.resolve("./lib/locale"));
const authorizationHandler = require(path.resolve(
    "./lib/authorizationHandler"
));

/*
 * 全局变量
 */

// var event = new events.EventEmitter(); // 根本没用到

// 用来修改，简化bot和MCServer对象交互时互传对象的问题。
// ! 二次开发需要注意，避免创造竞态条件
var queuedCommands = [];
var queuedCommandSenders = [];
var MCServerAuthed = false;
var MCCommandBuffer = "";
var lastCommandSender = {};

/*
 * 回调函数
 */

/**读取配置文件，同步地。
 * Read config file from './config/active-config.yml', Synchronically.
 * @returns Object
 */
function read_config_Sync(file_addr) {
    if (!file_addr) {
        file_addr = path.resolve("./config/config.yml");
    }
    let file = fs.readFileSync(file_addr, "utf-8");
    let config = YAML.parse(file);
    return config;
}

/** 使用一个已连接的rcon实例发送消息
 * 该函数的副作用是修改了全局变量MCCommandBuffer和queuedCommandSenders，并且在客户端未验证时还会修改queuedCommands
 * @param {RCON} MCServer 一个已经连接成功的rcon实例
 * @param {String} msg 需要发送的纯文本字符串
 * @param {Mirai.Target} sender 一个Mirai.Target对象，即Friend, Group, Temp函数的返回值
 */
function MCCommandSend(MCServer, msg, sender) {
    MCCommandBuffer = msg;
    // RCON客户端已验证就发送消息
    if (MCServerAuthed) {
        MCServer.send(MCCommandBuffer);
    } else {
        queuedCommands.push(MCCommandBuffer);
    }
    queuedCommandSenders.push(sender);
    MCCommandBuffer = "";
}

/*
 * 主函数体
 */

// 1. 读取配置
const CONFIG = read_config_Sync();
// 1.1 读取Mirai安装位置和配置
const MIRAI_CONFIG = read_config_Sync(
    path.join(
        CONFIG["MiraiPath"] + `/config/net.mamoe.mirai-api-http/setting.yml`
    )
);
const miraiHost =
    "http://" + // 没有开头这一坨，端口号就被识别为主机名了，nodejs:DNS的实现问题
    // // 哈哈 debug了两三天源码都翻了
    MIRAI_CONFIG["adapterSettings"]["http"]["host"] +
    ":" +
    MIRAI_CONFIG["adapterSettings"]["http"]["port"];

// 1.2 创建MC服务器连接
var MCServer = new RCON(
    CONFIG["Minecraft-Server-Host"],
    CONFIG["rcon-port"],
    CONFIG["rcon-verification"] != null ? CONFIG["rcon-verification"] : ""
);

// 1.3 创建Mirai bot
var bot = new Mirai({
    host: miraiHost,
    verifyKey: MIRAI_CONFIG["verifyKey"],
    qq: CONFIG["QQ"],
});

// 1.3.1 auth 认证
bot.onSignal("authed", () => {
    console.log(
        TEXTS["MIRAI_AUTHED"].replace("${bot.sessionKey}", bot.sessionKey)
    );
    bot.verify();
});

// 1.3.2 session 校验回调
bot.onSignal("verified", async () => {
    console.log(
        TEXTS["MIRAI_VERIFIED"].replace("${bot.sessionKey}", bot.sessionKey)
    );

    // 获取好友列表
    // 感觉用不上
    // const friendList = await bot.getFriendList();
    // console.log('\t'+TEXTS["MIRAI_FRIEND_LIST"].replace("${bot.qq}", bot.qq).replace("${friendList.length}", friendList.length));
});

// 1.4 设置退出前关闭两边的session
process.on("exit", () => {
    bot.release();
    console.log(TEXTS["MIRAI_DISCONNECTING"]);
    MCServer.disconnect();
    console.log(TEXTS["MCSERVER_DISCONNECTING"]);
});

// 2 设置MC服务器监听逻辑

// 2.1 连接+认证成功
// You must wait until this event is fired before sending any commands,
// otherwise those commands will fail.
MCServer.on("auth", function () {
    console.log(TEXTS["MCSERVER_AUTH"]);
    MCServerAuthed = true;
    // 刚认证成功时，清空所有队列中的未发送指令
    queuedCommands.forEach((item) => {
        if (item) {
            MCServer.send(item);
        }
    });
    queuedCommands = [];

    // MCServer.send("help");
})
    // 2.2 收到响应，调用机器人予以答复
    .on("response", (str) => {
        if (queuedCommandSenders) {
            // 此处耦合了Mirai的调用
            // 对于过长的响应，RCON会分成多个response事件，因此这里的队列不能简单地用shift弹出。
            // !! 目前的这种按队列更新的格式可能不能支持竞态条件下多响应目标的数据分别传达
            // TODO 可能需要使用定时回收lastCommandSender 或者采用别的算法以调度分包的情形
            if (queuedCommandSenders[0]) {
                lastCommandSender = queuedCommandSenders[0];
            }
            bot.sendMessage(str, lastCommandSender);
        } else {
            console.warn(TEXTS["MCSERVER_RES_SENDER_NOT_FOUND"] + str);
        }
    })
    // 2.3 发生错误，不得向好友发送回显以保证安全
    .on("error", function (err) {
        console.warn("Error: " + err);
    })
    // 2.4 结束事件。什么时候这玩意才会结束呢？
    .on("end", function () {
        console.warn(TEXTS["MCSERVER_DISCONNECTING"]);
    });

// 3. 设置Mirai主业务逻辑事件监听器
// 3.1 收到消息，检查是指令还是别的
bot.onMessage(async (message) => {
    const { type, sender, messageChain, reply, quoteReply } = message;
    let msg = "";
    messageChain.forEach((chain) => {
        if (chain.type === "Plain") {
            msg += Plain.value(chain);
        } // 从 messageChain 中提取文字内容
    });

    // 3.1.1 mc指令必须以'/'开头
    if (msg.indexOf("/") == 0) {
        // 判断是否有权限
        if (authorizationHandler.isPermitted(msg.slice(1), sender.id)) {
            MCCommandSend(MCServer, msg, Friend(sender.id));
            // 返回回显消息，先不接入RCON那边吧
            reply(TEXTS["COMMAND_SENT"]);
        } else {
            // 无权限
            reply(TEXTS["NOT_PERMITTED_COMMAND"]);
        }
    } else {
        // 3.1.2 非mc指令，尝试进行内置指令解析
        // 3.1.2.1 内置指令必须以'!!RCON '开头，后面的内容必须完全匹配
        switch (msg) {
            // 内置指令懒得做可扩展了，就写在这里吧
            // TODO 内置指令使用可扩展的函数表映射，最好放在./lib/embeddedCalls.js里
            // ? 外置指令会需要传入bot对象和MCServer对象，有无更优办法？
            case "!!RCON help": {
                /* 发送Bot使用帮助 */
                reply(TEXTS["RCON-BOT_HELP"]);
                break;
            }
            case "!!RCON myPerm": {
                /* 列出所有当前sender可用的权限 */
                let perms = authorizationHandler.listPerms(sender.id);
                reply(TEXTS["CURR_PERM_TEMPLATE"] + perms);
                break;
            }
            default: {
                // 3.1.2.2 不是内置指令，无视
                break;
            }
        }
    }
});

bot.on("error", (error) => {
    console.error(error);
});

//  4. 开始两头的主事件循环，自行检查有无指令事件

/* Mirai监听消息
 * 为了权限控制起见，推荐只接受好友消息（其实是群组适配没做）
 * 'all' - 监听好友和群
 * 'friend' - 只监听好友
 * 'group' - 只监听群
 * 'temp' - 只监听临时会话
 */
// TODO 群组控制适配
// TODO 把从哪里接收消息的选项加到config.yml里
bot.listen("friend");
MCServer.connect();

const { Console } = require("console");
const fs = require("fs");
const path = require("path");
const YAML = require("yaml");

try {
    /**
     * 该文件产生一个对象，包含若干个正则表达式字符串数组。
     */
    var commandPermitted = YAML.parse(
        fs.readFileSync(path.resolve("./config/mc-commands.yml"), "utf-8")
    );
    /**
     * 该文件产生一个对象，包含若干个整数或null数组
     */
    var rolePermitted = YAML.parse(
        fs.readFileSync(path.resolve("./config/user-group.yml"), "utf-8")
    );
    console.log("[Authorization] config load finished");
    console.log("[Authorization] load out is as follows:");
    console.log("==== Command List ====");
    console.log(commandPermitted);
    console.log("\n==== User List ====");
    console.log(rolePermitted);
    console.log("\n[Authorization] ========\n");
} catch (err) {
    console.error(err);
    process.exit(2);
}
/**
 * 该函数判断传入的消息与执行者是否满足权限条件。
 * @param msg:string 一个需要判断是否满足条件的指令。
 * @param doer:Number 一个执行者，需要是QQ号整数。
 * @returns [true|false] 是否满足权限条件
 */

function isPermitted(msg, doer) {
    // let commandKeys = Object.getOwnPropertyNames(commandPermitted);
    var roleKeys = Object.getOwnPropertyNames(rolePermitted);
    var currentGroup = "";
    var permitted = false;

    // 先检查doer是否在权限列表中。
    roleKeys.forEach((groupName) => {
        if (
            !currentGroup && // 没有确认过权限组
            !!rolePermitted[groupName] && // 权限组不为null
            rolePermitted[groupName].includes(doer) // QQ号在该权限组内
        ) {
            currentGroup = groupName; // 确认权限组
        }
    });

    // 不在任何权限列表，直接返回
    if (!currentGroup) {
        return false;
    }
    // 此时，玩家已确认位于${currentGroup}(GroupName)权限组，到对应组查找是否有指令权限。
    commandPermitted[currentGroup].forEach((commandPattern) => {
        if (
            // 正则匹配确认是否有权限
            msg.search(commandPattern) == 0
        ) {
            // 这是回调函数内，不能直接return（呕）
            permitted = true;
        }
    });
    return permitted;
}

/** 该函数直接返回参数对应的QQ号所在权限组的权限。
 * 
 * @param {Number} doer 一个QQ号。
 * @returns Array[String | Null] 表示该用户所有权限的字符串数组。
 */
function listPerms(doer) {
    var roleKeys = Object.getOwnPropertyNames(rolePermitted);
    var currentGroup = "";

    // 先检查doer是否在权限列表中。
    roleKeys.forEach((groupName) => {
        if (
            !currentGroup && // 没有确认过权限组
            !!rolePermitted[groupName] && // 权限组不为null
            rolePermitted[groupName].includes(doer) // QQ号在该权限组内
        ) {
            currentGroup = groupName; // 确认权限组
        }
    });

    // 不在任何权限列表，直接返回空数组
    if (!currentGroup) {
        return [];
    } else {
        // 已确认权限组，返回对应的组权限
        return commandPermitted[currentGroup];
    }
}


module.exports = { isPermitted, listPerms };

<<<<<<< HEAD
# 项目说明

本中间件基于[node-mirai-sdk](https://github.com/RedBeanN/node-mirai)和[node-rcon](https://github.com/pushrax/node-rcon)开发，采用AGPL3.0许可证发布源码。

本项目是对mirai QQ机器人及RCON客户端的封装，以此实现了经由QQ机器人远程控制RCON服务器，如Minecraft服务器等。（事实上，本项目目前版本仅适配了Minecraft一款游戏）。

# 安装
1. 在本地方便的位置[安装](https://github.com/iTXTech/mcl-installer) [Mirai机器人](https://github.com/mamoe/mirai)及[mirai-api-http插件](https://github.com/project-mirai/mirai-api-http)，安装及运行方式参见官方文档。

2. 至少登陆一次mirai机器人，确认其工作正常。

3. 克隆本项目到本地，并在CMD中输入```npm install```，让npm自动安装所有需要的库。

4. 配置./config/config.yml文件：

```YAML
# 本程序配置项
lang: zh-cn # 选择您喜欢的语言，多语种文件需存放在./locale/下

# Minecraft 配置项
# 以下内容联系您的MC服主获取，若您是服主，则查看server.properties文件。注意rcon服务默认关闭。
Minecraft-Server-Host: localhost
rcon-port: 25575
rcon-verification: password

# Mirai 机器人配置项
MiraiPath: D:/Runtime/Mirai # 安装第一步中mirai机器人的路径
QQ: 1145141919 # 要在远控中使用的机器人，需登录到mirai机器人
PW: 1234abcd # qq密码

```

5. 配置权限组：修改./config/mc-commands.yml和user-group.yml，细节请参看此二文件内注释。

mc-commands.yml:

```YAML
# 本文件表示显式允许执行的指令。在本中间件中，采用msg.search(本文件列表项目)的方式匹配，支持正则表达式。
# 权限组应当与user-group.yml文件中的分组一一对应。
# 条目开头的~*两种符号需要用引号包裹。

# 正规OP，默认给所有服务器可执行的指令权限（除了stop）
op:
    - .+ # 虽然您可以使用这种通配符，但服务器性能和安全起见，仍然建议您列出Minecraft原版的所有指令样式。

# 建筑师，给fill相关指令
architect:
    - fill

# 警探，给ledger相关指令，模组地址：https://github.com/QuiltServerTools/Ledger
# 该指令需要一个玩家作为执行者，因此实际上并不能成功生效，此处用作测试用途。
police:
    - ledger i
    - lg i

# 人事官，给whitelist ban相关指令
HR:
    - whitelist add
    - whitelist remove

   ```

user-group.yml:

```YAML
# 填QQ号。
# 为安全考虑，配置文件都只允许服务器主机本地修改，并且必须重启。
# 权限组应当与mc-commands.yml文件中的分组一一对应。

# 注意，权限组从上到下覆盖（例：用户114514同时位于architect和police内，则将会被识别为architect权限。）
# 如果需要给某些人分配跨组权限，请新建一个专门的组，并将此人分配到该组。

# 正规OP，默认给所有服务器可执行的指令权限
op:
    - 1234567

# 建筑师  例：给fill相关指令
architect:
    - 114514

# 警探  例：给ledger i相关指令
police:
    - 1919810

# 人事官  例：给whitelist、ban相关指令
HR:

```

# 使用
1. 参考官方文档启动mirai机器人并登录。

   *注：如果机器人部署在远端，则暂时无法使用，后续版本会支持。*

2. 确认mc服务器的rcon配置正确，并启动mc服务器。

3. 启动本应用:

```bash
node index.js
// 或：
npm start
```
4. 从列在了权限组内的qq号向bot私聊发送您的指令（如!!RCON help，!!RCON myPerm等内嵌指令，或以“/”开头的minecraft指令）。
   ![基本使用示例](./doc/basic%20usage.JPG)

# 常见问题
1. "Error: connect ECONNREFUSED...": mirai机器人或MC服务器的RCON端口无法连接。您需要先运行这两个应用，再运行本应用。具体是谁不能运行，请查看无法连接的是哪个端口，该端口号理应与您的config.yml设置是对应的。若MC服务器部署在远端，则除默认游戏连接端口外，可能还需要为rcon也配置端口映射。

2. 远程控制机器人没有反应：指令输入不完全正确，或没有给控制者添加权限。若是内嵌指令没有响应，则请检查机器人运行状况或提出issue。

3. // 欢迎发issue提问

# 二次开发
请遵守本项目协议（AGPL3.0）及mirai、node-mirai-sdk、node-rcon项目的二次开发条款。

您的二次开发可以从本项目fork，但本项目不保证具备可扩展性，也不保证您的开发体验。

本项目可以针对如下部分进行二次开发：
- 群聊控制适配
- 应用控制的指令替换映射
- 丰富内嵌指令
- 部分内嵌回显字符串的本地化适配

# 多语言适配
~我做本地化干什么~

欢迎对本项目进行多语言适配，您只需复制一份./locale/下已有的语言文件，按照国际标准重命名为语言代码.json，再加以修改即可。

要使用您的翻译，只需修改./config/config.yml里的lang字段。
=======
# 项目说明

本中间件基于[node-mirai-sdk](https://github.com/RedBeanN/node-mirai)和[node-rcon](https://github.com/pushrax/node-rcon)开发，采用AGPL3.0许可证发布源码。

本项目是对mirai QQ机器人及RCON客户端的封装，以此实现了经由QQ机器人远程控制RCON服务器，如Minecraft服务器等。（事实上，本项目目前版本仅适配了Minecraft一款游戏）。

# 安装
1. 在本地方便的位置[安装](https://github.com/iTXTech/mcl-installer) [Mirai机器人](https://github.com/mamoe/mirai)及[mirai-api-http插件](https://github.com/project-mirai/mirai-api-http)，安装及运行方式参见官方文档。

2. 至少登陆一次mirai机器人，确认其工作正常。

3. 克隆本项目到本地。

4. 配置./config/config.yml文件：

```YAML
# 本程序配置项
lang: zh-cn # 选择您喜欢的语言，多语种文件需存放在./locale/下

# Minecraft 配置项
# 以下内容联系您的MC服主获取，若您是服主，则查看server.properties文件。注意rcon服务默认关闭。
Minecraft-Server-Host: localhost
rcon-port: 25575
rcon-verification: password

# Mirai 机器人配置项
MiraiPath: D:/Runtime/Mirai # 安装第一步中mirai机器人的路径
QQ: 2932087520 # 要在远控中使用的机器人，需登录到mirai机器人
PW: 1234abcd # qq密码

```

5. 配置权限组：修改./config/mc-commands.yml和user-group.yml，细节请参看此二文件内注释。

mc-commands.yml:

```YAML
# 本文件表示显式允许执行的指令。在本中间件中，采用msg.search(本文件列表项目)的方式匹配，支持正则表达式。
# 权限组应当与user-group.yml文件中的分组一一对应。
# 条目开头的~*两种符号需要用引号包裹。

# 正规OP，默认给所有服务器可执行的指令权限（除了stop）
op:
    - .+ # 虽然您可以使用这种通配符，但服务器性能和安全起见，仍然建议您列出Minecraft原版的所有指令样式。

# 建筑师，给fill相关指令
architect:
    - fill

# 警探，给ledger相关指令，模组地址：https://github.com/QuiltServerTools/Ledger
# 该指令需要一个玩家作为执行者，因此实际上并不能成功生效，此处用作测试用途。
police:
    - ledger i
    - lg i

# 人事官，给whitelist ban相关指令
HR:
    - whitelist add
    - whitelist remove

   ```

user-group.yml:

```YAML
# 填QQ号。
# 为安全考虑，配置文件都只允许服务器主机本地修改，并且必须重启。
# 权限组应当与mc-commands.yml文件中的分组一一对应。

# 注意，权限组从上到下覆盖（例：用户114514同时位于architect和police内，则将会被识别为architect权限。）
# 如果需要给某些人分配跨组权限，请新建一个专门的组，并将此人分配到该组。

# 正规OP，默认给所有服务器可执行的指令权限
op:
    - 1234567

# 建筑师  例：给fill相关指令
architect:
    - 114514

# 警探  例：给ledger i相关指令
police:
    - 1919810

# 人事官  例：给whitelist、ban相关指令
HR:

```
>>>>>>> bd20191 (comments: added some TODOs)

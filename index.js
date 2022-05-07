const Discord = require("discord.js");
const fs = require("fs")

const events = require("./bot_system/event")
const options = require("./bot_system/options")

process.chdir(__dirname)

if (process.argv.length == 3) {
    if (["true", "release"].includes(process.argv[2]))
        options.isrelease = true
    else
        options.isrelease = false
} else {
    console.log("isrelease を入力してください")
    process.exit()
}
console.log(options.isrelease)

// 新しいDiscordクライアントを作成
const {
    Client,
    Intents
} = require("discord.js");
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_VOICE_STATES]
})
options.client = client

// eventsを全てclientに登録
events.forEach(({
    name,
    handler
}) => client.on(name, handler))

options.optionsdir = require("os").homedir() + "/Documents/Discord_App/Praxi/"
console.log(options.optionsdir)
//フォルダの自動生成
if (!fs.existsSync(options.optionsdir + "guilds/")) {
    fs.mkdirSync(options.optionsdir + "guilds", {
        recursive: true
    })
}
//tokenファイルの有無確認
if (!fs.existsSync(options.optionsdir + "token")) {
    fs.writeFileSync(options.optionsdir + "token", "")
    console.log("\"" + options.optionsdir + "/token\" に token を入力してください")
    process.exit()
} else {
    const token = fs.readFileSync(options.optionsdir + "token", "utf8")
    // トークンを使ってDiscordにログイン
    client.login(token)
}

/*
try {

} catch (e) {
    if (e.fileName && e.lineNumber) {
        // ファイル名と行番号が取得できたらメッセージとしてログに出力する
        let errMsg = "file: " + e.fileName + "line: " + e.lineNumber
        console.error(`${errMsg}`)
    }*/
//messageCreate.js

//メッセージが送信されたときに反応するイベント処理

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'name'.
const name = 'messageCreate'

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const Discord = require("discord.js")

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'options'.
const options = require("../options")
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require("../logger").logger

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'handler'.
const handler = (message: any) => {
    //システム,bot,コマンド応答のメッセージを除外
    if (message.system || message.author.bot || message.interaction !== null)
        return
    let mes = `${message.author.tag} in #${message.channel.name} sent: ${message.content}`
    logger.debug(mes)

    //メンション時応答
    if (message.mentions.has(options.client.user.id)) {
        message.channel.send("<@!" + message.member.id + ">：眠いからまたあとにしてにゃ")
    }

    //message.channel.send(mes)
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
    name,
    handler
}
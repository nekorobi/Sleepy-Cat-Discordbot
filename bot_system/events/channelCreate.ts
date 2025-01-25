//channelCreate.js

//チャンネルが作成されたイベントを取得
//bot用データにチャンネルデータを追加する指示
//ステージチャンネル未対応（フォーラムも）


// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'path'.
const path = require("path")

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ChannelTyp... Remove this comment to see the full error message
const { ChannelType } = require("discord.js")


// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'options'.
const options = require("../options")


// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'name'.
const name = path.basename(__filename, ".js")


// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'handler'.
const handler = (channel: any) => {
    if (channel.type == ChannelType.GuildText)
        options.channel_data_update("Create", "GUILD_TEXT", channel)
    else if (channel.type == ChannelType.GuildVoice)
        options.channel_data_update("Create", "GUILD_VOICE", channel)
    //ステージチャンネル未対応
    //else if (channel.type == ChannelType.GuildStageVoice)
    //    options.channel_data_update("Create", "GUILD_STAGE", channel)
}


// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
    name,
    handler
}
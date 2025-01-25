//channelDelete.js

//チャンネルが削除されたイベントを取得
//bot用データからチャンネルデータを削除する指示

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'path'.
const path = require("path")
const {
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ChannelTyp... Remove this comment to see the full error message
    ChannelType
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require("discord.js")

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'options'.
const options = require("../options")

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'name'.
const name = path.basename(__filename, ".js")

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'handler'.
const handler = (channel: any) => {
    if (channel.type == ChannelType.GuildText) //ChannelType.GuildText = 0
        options.channel_data_update("Delete", "GUILD_TEXT", channel)
    else if (channel.type == ChannelType.GuildVoice)
        options.channel_data_update("Delete", "GUILD_VOICE", channel)
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
    name,
    handler
}
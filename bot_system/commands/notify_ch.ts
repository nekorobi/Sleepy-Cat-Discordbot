//notify_ch.js

//VC参加時の参加通知を行うテキストチャンネルの指定


// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Applicatio... Remove this comment to see the full error message
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ChannelTyp... Remove this comment to see the full error message
const { ChannelType } = require('discord.js');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'options'.
const options = require("../options")


// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
    command: {
        type: ApplicationCommandType.ChatInput,
        name: "notify_ch",
        description: "VC通知をするチャンネルの変更",
        options: [{
            type: ApplicationCommandOptionType.Channel,
            channel_types: [ChannelType.GuildText],
            name: "textchannel",
            description: "TextChannel を選択"
        }, {
            type: ApplicationCommandOptionType.Channel,
            channel_types: [ChannelType.GuildVoice],
            name: "voicechannel",
            description: "VoiceChannel を選択"
        }]
    }
}

options.client.on("interactionCreate", async (interaction: any) => {
    if (!interaction.isCommand()) {
        return;
    }
    if (interaction.commandName === "notify_ch") {

        // @ts-expect-error TS(2304): Cannot find name 'textch_id'.
        textch_id = null

        // @ts-expect-error TS(2304): Cannot find name 'voicech_id'.
        voicech_id = null
        //vcに入っているとき
        if (interaction.member.voice.channelId !== null)

            // @ts-expect-error TS(2304): Cannot find name 'voicech_id'.
            voicech_id = interaction.member.voice.channelId
        //コマンドでの指定チャンネルidを取得，あれば優先

        // @ts-expect-error TS(2304): Cannot find name 'commandoption'.
        for (commandoption of interaction.options._hoistedOptions) {

            // @ts-expect-error TS(2304): Cannot find name 'commandoption'.
            if (commandoption.channel.type == ChannelType.GuildText)

                // @ts-expect-error TS(2304): Cannot find name 'textch_id'.
                textch_id = commandoption.value
            // @ts-expect-error TS(2304): Cannot find name 'commandoption'.
            else if (commandoption.channel.type == ChannelType.GuildVoice)

                // @ts-expect-error TS(2304): Cannot find name 'voicech_id'.
                voicech_id = commandoption.value
        }
        //textchの指定がないとき

        // @ts-expect-error TS(2304): Cannot find name 'textch_id'.
        if (textch_id === null)

            // @ts-expect-error TS(2304): Cannot find name 'textch_id'.
            textch_id = interaction.channelId


        // @ts-expect-error TS(2304): Cannot find name 'voicech_id'.
        if (voicech_id === null) {
            await interaction.reply("VoiceChannelを指定,またはVoiceChannelに参加した状態で実行してください");
            return
        } else {
            for (let i = 0; i < options.guild_data[interaction.guildId]["GUILD_VOICE"].length; i++) { //TODO

                // @ts-expect-error TS(2304): Cannot find name 'voicech_id'.
                if (options.guild_data[interaction.guildId]["GUILD_VOICE"][i]["ch_id"] === voicech_id) {

                    // @ts-expect-error TS(2304): Cannot find name 'textch_id'.
                    options.guild_data[interaction.guildId]["GUILD_VOICE"][i]["default_textchid"] = textch_id
                    options.guild_data_update(interaction.guildId)

                    // @ts-expect-error TS(2304): Cannot find name 'voicech_id'.
                    interaction.reply("<#" + voicech_id + "> の通知チャンネルを <#" + textch_id + "> に変更しました")
                    return
                }
            }
        }
    }
});
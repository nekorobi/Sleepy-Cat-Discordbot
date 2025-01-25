//bot_system.js

//botが持つサーバー情報表示(変更までできるようにしたい)
//（データファイル書き換えに行くのは面倒だし）

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Applicatio... Remove this comment to see the full error message
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'options'.
const options = require("../options")

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
    command: {
        type: ApplicationCommandType.ChatInput,
        name: "bot_system",
        description: "botのこのサーバーに関する設定",
        options: [{
            type: ApplicationCommandOptionType.String,
            name: "option",
            description: "\"設定内容\" を入力",
            required: true,
            choices: [
                {
                    name: "テキストチャンネルの表示",
                    value: "GUILD_TEXT"
                },
                {
                    name: "ボイスチャンネルの表示",
                    value: "GUILD_VOICE"
                }, {
                    name: "通知チャンネルの表示",
                    value: "notifych"
                }
            ]
        }]

    }
}

options.client.on("interactionCreate", async (interaction: any) => {
    if (!interaction.isCommand()) {
        return;
    }
    if (interaction.commandName === "bot_system") {
        //GUILD_TEXT or GUILD_VOICEの一覧を表示
        if (interaction.options._hoistedOptions[0].value === "GUILD_TEXT" ||
            interaction.options._hoistedOptions[0].value === "GUILD_VOICE") {
            let guildlist = options.get_channels(interaction.guildId, interaction.options._hoistedOptions[0].value)
            let text = interaction.guild.name + " : " + interaction.options._hoistedOptions[0].value
            // @ts-expect-error TS(2304): Cannot find name 'd'.
            for (d of guildlist) {
                // @ts-expect-error TS(2304): Cannot find name 'd'.
                text += "\n> " + d["name"]
            }
            interaction.reply(text)
        }
        //VCの通知チャンネルの一覧を表示
        if (interaction.options._hoistedOptions[0].value === "notifych") {
            let guildlist = options.get_channels(interaction.guildId, "GUILD_VOICE")
            let text = interaction.guild.name + " : NotifyChannel"
            // @ts-expect-error TS(2304): Cannot find name 'd'.
            for (d of guildlist) {
                // @ts-expect-error TS(2304): Cannot find name 'd'.
                text += "\n> " + d["name"] + "\n>    <#" + d["default_textchid"] + ">"
            }
            interaction.reply(text)
        }

        //await interaction.reply("bot_rename 未実装");
    }
});
//ping.js

//botにpingを送るコマンド，及びbotの反応

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'options'.
const options = require("../options.js")
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Applicatio... Remove this comment to see the full error message
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
    command: {
        type: ApplicationCommandType.ChatInput,
        name: "ping",
        description: "botが反応します（疎通確認にでも）"
    }
}

options.client.on("interactionCreate", async (interaction: any) => {
    if (!interaction.isCommand()) {
        return;
    }
    if (interaction.commandName === "ping") {
        await interaction.reply("眠いからまた後にしてにゃ");
    }
});
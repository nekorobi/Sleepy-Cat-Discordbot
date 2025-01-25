//showver.js

//botに関する情報を表示したい

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'options'.
const options = require("../options")
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Applicatio... Remove this comment to see the full error message
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
    command: {
        type: ApplicationCommandType.ChatInput,
        name: "showver",
        description: "実行中のbotのVersionを表示します"
    }
}

options.client.on("interactionCreate", async (interaction: any) => {
    if (!interaction.isCommand()) {
        return;
    }
    if (interaction.commandName === "showver") {
        // @ts-expect-error TS(2552): Cannot find name 'text'. Did you mean 'Text'?
        text = "Bot ver. " + "???" + "\n"
        // @ts-expect-error TS(2552): Cannot find name 'text'. Did you mean 'Text'?
        text += "discord.js@" + "14.3.0"
        // @ts-expect-error TS(2552): Cannot find name 'text'. Did you mean 'Text'?
        await interaction.reply(text);
    }
});
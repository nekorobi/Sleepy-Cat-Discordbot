//ready.js

//bot起動時に行われる処理
//botの起動準備


// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'options'.
const options = require("../options")

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const commands = require("../commands")

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require("../logger").logger

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'name'.
const name = 'ready'


// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'handler'.
const handler = () => {

    options.initialize()

    set_commands()

    logger.info("Logged in")
    logger.info("name:", options.client.user.tag)
    logger.info("id:", options.client.user.id)
    logger.info("version:", options.version)
    logger.info("-----------------------------------------------")
    logger.info("bot is online");

}

async function set_commands() {
    for (const guild_d of options.guild_list) {
        await options.client.application.commands.set(commands.get_commands(), guild_d["id"])
    }
    logger.info("command set")
}


// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
    name,
    handler
}
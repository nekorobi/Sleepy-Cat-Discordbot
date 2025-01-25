//commands.js

//ボットにコマンドを登録する処理


// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fs'.
const fs = require("fs")

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require("./logger").logger


// @ts-expect-error TS(2304): Cannot find name 'commands_data'.
commands_data = []

// @ts-expect-error TS(2304): Cannot find name '__dirname'.
logger.info(__dirname)


// @ts-expect-error TS(2304): Cannot find name '__dirname'.
fs.readdir(__dirname + '/commands', (err: any, files: any) => {
    files.forEach((file: any) => {

        // @ts-expect-error TS(2304): Cannot find name 'commands_data'.
        commands_data.push(require("./commands/" + file)["command"])
    })
})


// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.get_commands = () => {

    // @ts-expect-error TS(2304): Cannot find name 'commands_data'.
    return commands_data
}
// events.js

//DiscordAPIのイベントを登録


// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fs'.
const fs = require("fs")

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require("./logger").logger


// @ts-expect-error TS(2304): Cannot find name 'events_data'.
events_data = []



// @ts-expect-error TS(2304): Cannot find name '__dirname'.
fs.readdirSync(__dirname + '/events').forEach((file: any) => {

    // @ts-expect-error TS(2304): Cannot find name 'events_data'.
    events_data.push(require("./events/" + file))
})

// @ts-expect-error TS(2304): Cannot find name 'events_data'.
logger.info("event list:", events_data)


// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = events_data
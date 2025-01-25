//messagepost.js

//botのテスト時，テキストを送信する代わりにコンソールに出力
//コマンド処理になってきているので使われることはほぼない

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'options'.
const options = require("./options")
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require("./logger").logger

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.send_message = (channel: any, mes: any) => {
    if (!options.is_release) {
        //テスト中はコンソールにログが出る
        logger.debug("チャンネル：" + channel + "\n" + mes + " を投稿しようとしました")
    } else if(channel !== undefined){
        channel.send(mes)
    }
}
/**index.js
 * botのmainプログラム
 * 起動時に実行するファイル
**/

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'options'.
const options = require("./bot_system/options")

// コマンドライン引数の読み込み
if (!options.get_cli_options()) {
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    process.exit()
}

// 設定ファイルの読み込み
if (!options.load_settings_file()) {
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    process.exit()
}

options.create_client()

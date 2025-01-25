// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const log4js = require("log4js")
// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.logger = log4js.getLogger()
// TODO ファイル保存、ログレベル等の設定機能をつける
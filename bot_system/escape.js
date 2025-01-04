//escape.js

const { escapeMarkdown } = require("discord.js")

//メッセージのMDエスケープ
//ヘッダーについては Discord.js が非対応のため、独自で実装

exports.escapeHeaders = (text) => {
    return text
        .replaceAll(/^\#/g, '\\#')
        .replaceAll(/^-\#/g, '\\-#')
}

exports.escapeAllMarkdown = (text) => this.escapeHeaders(escapeMarkdown(text))

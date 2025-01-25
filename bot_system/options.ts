//options.js

//データファイルの読み込み，変更をするプログラムを集約

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const cli_option = require("commander")
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ChannelTyp... Remove this comment to see the full error message
const { Client, ChannelType, GatewayIntentBits } = require("discord.js")
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fs'.
const fs = require("fs")
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const yaml = require("js-yaml")
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'path'.
const path = require("path")

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const consts = require("./consts")
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const events = require("./events")
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require("./logger").logger

const GUILD_TEXT = "GUILD_TEXT"
const GUILD_VOICE = "GUILD_VOICE"
let CHANNEL_TYPE_DICT = {}
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
CHANNEL_TYPE_DICT[ChannelType.GuildText] = GUILD_TEXT
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
CHANNEL_TYPE_DICT[ChannelType.GuildVoice] = GUILD_VOICE

const DEFAULT_TEXTCHID = "default_textchid"

logger.debug(CHANNEL_TYPE_DICT)

// ボットバージョン
// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.version = undefined
// 実行モード
// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.is_release = false
// ボットクライアントインスタンス
// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.client = undefined
// 設定ファイルのディレクトリ
// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.option_dir = consts.DEFAULT_OPTION_DIR
// ボットトークン
// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.token = undefined

// 更新内容ファイル
// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.update = undefined

// 参加したDiscordサーバーの一覧
// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.guild_list = []

/**
* 起動時のオプション引数を取得する
*/
// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.get_cli_options = () => {
    // コマンドラインのオプション引数設定
    cli_option
        .option("-r, --release_mode", "リリースモードで起動します", false)
        .option("-d, --option_dir <optionValue>", "設定ディレクトリパスを指定", consts.DEFAULT_OPTION_DIR)

    cli_option.parse()

    const cli_option_val = cli_option.opts()
    // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
    this.is_release = cli_option_val.release_mode
    // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
    logger.info(`${this.is_release ? "リリース" : "テスト"}モードで起動開始`)

    // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
    this.option_dir = cli_option_val.option_dir

    return true
}

/**
 * 設定ファイルの読み込み
 */
// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.load_settings_file = () => {
    // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
    const settings_file_path = this.parse_option_path(consts.SETTING_FILENAME)

    logger.info(`設定を${settings_file_path}から取得します`)

    if (!fs.existsSync(settings_file_path)) {
        logger.critical("設定ファイルが存在しません")
        return false
    }

    // 設定ファイルの読み込み
    const settings = yaml.load(fs.readFileSync(settings_file_path, "utf8"))

    // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
    this.token = settings["token"] ?? undefined

    // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
    if (this.token === undefined) {
        logger.critical("tokenが設定されていません")
        return false
    }
    logger.debug("tokenを取得しました")
    return true
}

/**
 * ボットの権限を設定し、クライアントのインスタンスを生成する
 */
// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.create_client = () => {
    // Discordクライアントを作成
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.MessageContent
        ],
    })
    // eventsを全てclientに登録
    events.forEach(({
        name,
        handler
    }: any) => client.on(name, handler))
    // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
    client.login(this.token)
    // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
    this.client = client
}

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.get_voice_default_channel = (guildid: any, channelid: any) => {
    // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
    for (const vc_ch of this.guild_data[guildid][GUILD_VOICE]) {
        if (vc_ch["ch_id"] == channelid) {
            // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
            const ch = this.client.channels.cache.get(vc_ch[DEFAULT_TEXTCHID])
            return ch
        }
    }
}

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.initialize = () => {
    // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
    this.guild_data = {}
    //ボット更新情報の読み込み
    // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
    this.update = yaml.load(fs.readFileSync(this.parse_option_path(consts.UPDATE_FILENAME), "utf8"))

    // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
    this.version = this.get_version()

    // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
    this.guild_list = this.client.guilds.cache.map((a: any) => [a.id, a.name])

    // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
    for (const g of this.guild_list) {
        // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
        this.guild_data[g[0]] = { "guild_name": g[1] }
    }

    //guildsフォルダの自動生成
    // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
    let guilds_option_dir_path = this.parse_option_path(consts.GUILDS_DIRNAME)
    if (!fs.existsSync(guilds_option_dir_path)) {
        fs.mkdirSync(guilds_option_dir_path, {
            recursive: true,
        })
    }

    // ボットが参加しているサーバー一覧のファイルを保存
    // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
    const guilds_list_file_path = this.parse_option_path(consts.GUILDS_FILENAME)
    // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
    fs.writeFileSync(guilds_list_file_path, JSON.stringify(this.guild_list, null, 2))

    // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
    for (const g_id in this.guild_data) {
        // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
        const guild_channels_file_path = this.parse_option_path(consts.GUILDS_DIRNAME, `${g_id}.json`)
        // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
        const target_guild = this.guild_data[g_id]

        // サーバーに存在するチャンネル一覧の取得
        target_guild[GUILD_TEXT] = []
        target_guild[GUILD_VOICE] = []

        let saved_voicech_setting = {}

        if (fs.existsSync(guild_channels_file_path)) {
            // ボイスチャット設定済みのチャンネルを読み込み
            logger.debug(`${guild_channels_file_path}から設定済みのチャンネル一覧を読み込みます`)
            const voice_chs = JSON.parse(fs.readFileSync(guild_channels_file_path, "utf8"))[GUILD_VOICE]
            for (const voice_ch of voice_chs) {
                // 保存されたファイルの設定を取得
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                saved_voicech_setting[voice_ch["ch_id"]] = voice_ch[DEFAULT_TEXTCHID]
            }
        } else {
            logger.debug(`${guild_channels_file_path}は存在しません`)
        }

        // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
        const guild = this.client.guilds.cache.get(g_id)
        const system_ch_id = guild.systemChannelId
        // JSONファイル内の形式のの変換処理まで一気にできそうな気がするが
        // NOTE sqliteでの管理に変更予定（別ブランチ）
        const channels = guild.channels.cache.map((ch: any) => { return { ch_type: ch.type, ch_id: ch.id, ch_name: ch.name } })

        for (const ch of channels) {
            const ch_type_str = String(ch["ch_type"])
            if (!(ch_type_str in CHANNEL_TYPE_DICT)) {
                continue
            }
            // @ts-expect-error TS(2304): Cannot find name 'ch_type_text'.
            ch_type_text = CHANNEL_TYPE_DICT[ch_type_str]
            let ch_entry = {
                ch_id: ch["ch_id"],
                name: ch["ch_name"]
            }
            // @ts-expect-error TS(2304): Cannot find name 'ch_type_text'.
            if (ch_type_text !== GUILD_VOICE) {
                // デフォルトの通知先はシステムチャンネル（generalなど）を指定
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                ch_entry[DEFAULT_TEXTCHID] = system_ch_id
                if (ch["ch_id"] in saved_voicech_setting) {
                    // ファイルに保存されている内容がある場合はそのままコピー
                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    ch_entry[DEFAULT_TEXTCHID] = saved_voicech_setting[ch["ch_id"]]
                }
            }
            // @ts-expect-error TS(2304): Cannot find name 'ch_type_text'.
            target_guild[ch_type_text].push(ch_entry)
        }

        // 更新済みの設定ファイルを保存
        fs.writeFileSync(guild_channels_file_path, JSON.stringify(target_guild, null, 2))
    }
    // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
    logger.debug(this.guild_data)
}

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.guild_data_update = (guild_id: any) => {
    // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
    fs.writeFileSync(this.parse_option_path(consts.GUILDS_DIRNAME, `${guild_id}.json`), JSON.stringify(this.guild_data[guild_id], null, 2))
}

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.get_version = () => {
    // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
    return this.update[0]["ver"]
}

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.channel_data_update = (type: any, channel_type: any, channel: any) => {
    let ch_data = {}
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    ch_data["ch_id"] = channel.id
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    ch_data["name"] = channel.name
    //チャンネル作成時
    if (type == "Create") {
        //VCのみデフォルトの通知チャンネルを設定
        if (channel_type == GUILD_VOICE) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            ch_data[DEFAULT_TEXTCHID] = channel.g.systemChannelId
        }
        // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
        this.guild_data[channel.guildId][channel_type].push(ch_data)
        logger.info(channel.name, "を", channel_type, "として追加しました")
    }
    //チャンネル削除時
    else if (type == "Delete") {
        // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
        const ch_index = this.guild_data[channel.guildId][channel_type].map((ch: any) => ch["ch_id"]).indexOf(channel.id)
        if (ch_index != -1) {
            // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
            this.guild_data[channel.guildId][channel_type].splice(ch_index, 1)
        }
        logger.info(`${channel.name}を${channel_type}から削除しました`)
    }
    // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
    this.guild_data_update(channel.guildId)
}

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.get_channels = (guildid: any, channeltype: any) => {
    // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
    return this.guild_data[guildid][channeltype]
}

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.parse_option_path = (...paths: any[]) => {
    // @ts-expect-error TS(7041): The containing arrow function captures the global ... Remove this comment to see the full error message
    let joined_path = this.option_dir
    paths.forEach(function (element) {
        joined_path = path.join(joined_path, element)
    })
    return joined_path
}
//voiceStateUpdate.js

//通話の入退出，画面共有を感知し，通知を行う

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'name'.
const name = 'voiceStateUpdate'
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'options'.
const options = require("../options")

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const messagepost = require("../messagepost")
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require("../logger").logger

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'handler'.
const handler = (oldStatus: any, newStatus: any) => {
    //対象がbotの場合はスルー
    if (newStatus.member.user.bot)
        return

    logger.debug("change voice status")
    if (oldStatus.channel != newStatus.channel) {
        //ボイチャ参加  対象がbotの場合は判定なし
        if (newStatus.channel != null && !newStatus.member.user.bot) __join_vc(newStatus)
        //ボイチャ退出
        else if (oldStatus.channel != null) __leave_vc(oldStatus)
    }
    //画面共有の開始
    if (oldStatus.streaming != newStatus.streaming && newStatus.streaming) {
        const channel = __getVoiceDefaultChannel(newStatus)
        messagepost.send_message(channel, `${newStatus.member.displayName} が ${newStatus.channel} で画面共有を開始しました`)
    }
    //サーバーミュート（VoiseStatueのコンソール出力用）
    if (oldStatus.serverMute != newStatus.serverMute && newStatus.serverMute) {
        logger.debug("\nserverMute")
        console.dir(newStatus.member.presences, {
            depth: 3
        })
        logger.debug("\n")
    }
    //カメラ共有の開始
    if (oldStatus.selfVideo != newStatus.selfVideo && newStatus.selfVideo) {
        const channel = __getVoiceDefaultChannel(newStatus)
        messagepost.send_message(channel, `${newStatus.member.displayName} が ${newStatus.channel} でカメラ共有を開始しました`)
    }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
    name,
    handler
}

function __getVoiceDefaultChannel(status: any) {
    return options.get_voice_default_channel(status.guild["id"], status.channelId)
}

let vcDict = new Object();
/*{
    ボイチャチャンネルID（数字列）:{
        members (Setオブジェクト 重複なし):{}
        startTime:VCの開始時間
        vcBeginTime:2名以上が参加した時刻
        totalTime:2名以上のボイチャが継続された時間
    }
}*/

//通話参加時
function __join_vc(status: any) {
    logger.debug("join_vc");
    messagepost.send_message(
        __getVoiceDefaultChannel(status),
        `${status.member.displayName} が ${status.channel} に参加しました`)
    if (String(status.channelId) in vcDict) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        vcDict[status.channelId].members.add(status.member.id)
        if (__getUserLen(status) == 2) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            vcDict[status.channelId].vcBeginTime = new Date()
        }
    } else {
        let entry = new Object();
        // @ts-expect-error TS(2339): Property 'members' does not exist on type 'Object'... Remove this comment to see the full error message
        entry.members = new Set([status.member.id])
        // @ts-expect-error TS(2339): Property 'startTime' does not exist on type 'Objec... Remove this comment to see the full error message
        entry.startTime = new Date()
        // @ts-expect-error TS(2339): Property 'totalTime' does not exist on type 'Objec... Remove this comment to see the full error message
        entry.totalTime = 0
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        vcDict[status.channelId] = entry
    }
    logger.debug(vcDict)
}

//通話退出
function __leave_vc(status: any) {
    logger.debug("leave_vc");
    if (String(status.channelId) in vcDict) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        let entry = vcDict[status.channelId]
        if (__getUserLen(status) == 0) {
            if (entry.members.size >= 2) {
                logger.debug(entry.totalTime)
                logger.debug(__getHMS(entry.totalTime))
                let mes = `${status.channel}の通話が終了しました\n>>> `
                mes += `通話時間:${__getHMS(entry.totalTime)}\n`
                mes += `参加人数:${entry.members.size}人\n`
                mes += "参加者:"
                // @ts-expect-error TS(2304): Cannot find name 'membersArray'.
                membersArray = Array.from(entry.members)
                // @ts-expect-error TS(2304): Cannot find name 'membersArray'.
                membersArray.forEach((member: any) => {
                    logger.debug(member)
                    logger.debug(status.guild.members.cache.get(member).displayName)
                    // @ts-expect-error TS(2304): Cannot find name 'membersArray'.
                    mes += status.guild.members.cache.get(member).displayName + (member != membersArray[membersArray.length - 1] ? ", " : "")
                });
                messagepost.send_message(__getVoiceDefaultChannel(status), mes)
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                delete vcDict[status.channelId]
            }
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            delete vcDict[status.channelId]
        } else if (__getUserLen(status) == 1) {
            // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
            entry.totalTime += new Date() - entry.vcBeginTime
        }
    }
}

//時分秒,ミリ秒を返却
function __getHMS(tt: any) {
    let ms = tt % 1000
    tt = Math.trunc(tt / 1000)
    let s = tt % 60
    tt = Math.trunc(tt / 60)
    let m = tt % 60
    tt = Math.trunc(tt / 60)
    let h = tt
    let text = `${(h > 0 ? `${h}時間` : "")}${(m > 0 ? `${m}分` : "")}${s}.${ms}秒`
    return text
}

//BOT以外のユーザーの人数を返す関数
function __getUserLen(status: any) {
    let members = status.channel.members;
    let val = 0;
    members.forEach((member: any) => {
        if (!member.user.bot) val++
    });
    return val;
}
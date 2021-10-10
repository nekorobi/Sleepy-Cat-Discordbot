#need to pip install discord
import discord
from discord.activity import Streaming
from discord.ext import commands
from discord.ext import tasks
from distutils.util import strtobool
from discord.message import Message

from vcsupport import VCSupport

import sys
import re
import traceback
import os
import json

# 実行時に テスト版 or リリース版 を指定
isRelease=False
try:
    if sys.argv[1]=='test':
        isRelease=False
    elif sys.argv[1]=='release':
        isRelease=True
    else:
        raise Exception
except:
    print('リリース状況を正しく入力してください{test/release}')
    exit(1)

os.chdir(os.path.split(os.path.abspath(__file__))[0])

intents = discord.Intents.default()
intents.members = True
client = discord.Client(intents=intents)

with open('options.json','r',encoding='utf-8')as f:
    options=json.load(f)

slc=None

#メッセージ送信
async def message_send(mes,channel,istts=False):
    if isRelease:
        await client.get_channel(options['chID'][channel]).send(mes,tts=istts)
        return
    else:
        mes=channel+":"+mes
        await client.get_channel(options['chID']['bot-test']).send(mes,tts=istts)
        return

#コマンドの実行権限の確認
def isCommander(user):
    if user.id==slc.owner.id:#サーバー所有者
        return True
    role=slc.get_role(592960800935903242)#役職guri
    for member in slc.members:
        if member.id==user.id and role in member.roles:
            return True
    return False

#通話ステータスの変化を取得するイベント
@client.event
async def on_voice_state_update(member,before,after):
    print(member,before,after,sep='\n',end='\n\n')
    #通話参加時
    if before.channel!=after.channel and before.channel is None:
        memberDispName=memberDisplayName(member)
        mes=memberDispName+'が<#'+str(after.channel.id)+'>に参加しました'
        VCSupport.joinVC(after.channel,member)
        if after.channel.id==844511663096463380:
            await message_send(mes,'bot-test',options['VCtts'])
        else:
            await message_send(mes,'slcls',options['VCtts'])
        return
    #画面共有開始時
    if before.self_stream!=after.self_stream and before.self_stream is False:
        mes=memberDisplayName(member)
        mes+='が<#'+str(after.channel.id)+'>で画面共有を始めました'
        if after.channel.id==844511663096463380:
            await message_send(mes,'bot-test',options['VCtts'])
        else:
            await message_send(mes,'slcls',options['VCtts'])
        return
    #通話退出時
    if before.channel!=after.channel and after.channel is None:
        if len(before.channel.members)==0:
            mes='<#'+str(before.channel.id)+'>の通話が終了しました\n>>> '
            time,members=VCSupport.endVC(before.channel)
            if time != None and members !=None:
                print(time)
                #参加者が1人か，通話時間が1分未満の場合終了時メッセージは表示しない
                if len(members)==1 or (time[0][0]==0 and time[0][1]==0):
                    return
                mes+="通話時間："+time[1]+"\n"
                mes+="参加人数："+str(len(members))+"人\n"
                mes+="参加者："+",".join([memberDisplayName(m) for m in members])
            if before.channel.id==844511663096463380:
                await message_send(mes,'bot-test',options['VCtts'])
            else:
                await message_send(mes,'slcls',options['VCtts'])
        else:
            VCSupport.leaveVC(before.channel,member)
        return
    return

@client.event
async def on_message(message):
    try:
        #botか否か
        if message.author.bot:
            return
        print(message)
        print(message.content,'\n')
        #test版は#bot-testでのみ反応
        if not isRelease and message.channel.id!=options['chID']['bot-test']:
            return
        #リリース版は#bot-testで反応しない
        elif isRelease and message.channel.id==options['chID']['bot-test']:
            return
        #コマンド使用権限ありのみ
        if isCommander(message.author):
            if message.content.startswith('!vctts'):
                mes=message.content
                mes=re.sub('!vctts[ \n]','',mes)
                try:
                    me=bool(strtobool(mes))
                    if me==options['VCtts']:
                        mes='ボイチャ参加メッセージのttsは既に'
                        mes+='ON' if options['VCtts'] else 'OFF'
                        mes+='です'
                        await message.channel.send(mes)
                        return
                    options['VCtts']=me
                    options_update()
                    mes='ボイチャ参加メッセージのttsを'
                    mes+='ON' if options['VCtts'] else 'OFF'
                    mes+='にしました'
                    await message.channel.send(mes)
                except ValueError:
                    message.channel.send('入力形式が違います')
            #botのニックネーム変更
            if message.content.startswith('!chnick'):
                mes=message.content
                mes=re.sub('!chnick[ \n]','',mes)
                me=client.get_guild(options['guild_id']).me
                await me.edit(nick=mes)
                await message.channel.send('botのニックネームを'+mes+'に変更しました')
                return
            #botのゲームアクティビティの変更
            if message.content.startswith('!chgame'):
                mes=message.content
                mes=re.sub('!chgame[ \n]','',mes)
                await client.change_presence(activity=discord.Game(name=mes))
                await message.channel.send('botのステータスアクティビティを変更しました')
                return

        #このBotがmentionされたか
        if str(client.user.id)+'>' in message.content or '<@&'+str(792767547388854304)+'>' in message.content:
            mes='<@'+str(message.author.id)+'>：眠いからまたあとにしてにゃ'
            emoji='\N{Yawning Face}'
            await message.add_reaction(emoji)
            await message.channel.send(mes)
            return

        if message.content=='!showver':
            await message.channel.send('ver '+options["version"])

        #権限付きコマンドの使用権限の確認
        if message.content.startswith('!canCommand'):
            if isCommander(message.author):
                await message.channel.send(message.author.name+'は権限が必要なコマンドの使用ができます')
            else:
                await message.channel.send(message.author.name+'は権限が必要なコマンドの使用ができません')
            return

    except:
        me='エラー\n>>> ```'+traceback.format_exc()+'```'
        await client.get_channel(options['chID']['bot-test']).send(me)

#起動時
@client.event
async def on_ready():
    print('Logged in')
    print('name:',client.user.name)
    print('id:',client.user.id)
    await client.change_presence(activity=discord.Game(name='Bot'))
    print('------')

    global slc,guild_id
    slc=client.get_guild(options['guild_id'])
    print('サーバー:',slc)
    print('所有者:',slc.owner)
    if isRelease is False:
        await message_send(client.user.name+'(テスト版)が起動しました','bot-test')
    else:
        await message_send(client.user.name+'(リリース版)が起動しました','bot-test')
    #print(options)

#options.jsonの更新
def options_update():
    global options
    with open('options.json','w',encoding='utf-8')as f:
        json.dump(options,f,indent=4)

#メンバーの表示名を取得
def memberDisplayName(member):
    if member.nick is None:
        return member.name
    else:
        return member.nick

client.run(options['token'])

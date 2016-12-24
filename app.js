'use strict';
/**
 * Philly Wechat Server
 * https://github.com/Samurais/philly-wechat
 */

var TULING = require('tuling');
var tuling = new TULING({key: '18f25157e0446df58ade098479f74b21'});


const QrcodeTerminal = require('qrcode-terminal');
const {IoClient, Puppet, PuppetWeb, UtilLib, VERSION, Config, log, Wechaty, Message,  MediaMessage, Contact, Room, FriendRequest} = require('wechaty');

// const TULING123_API_KEY = '18f25157e0446df58ade098479f74b21'
// const brain = new Tuling123(TULING123_API_KEY)

var MsgType = Message.TYPE;

const bot = Wechaty.instance({
    profile: Config.DEFAULT_PROFILE
})

bot.on('scan', (url, code) => {
        if (!/201|200/.test(String(code))) {
            let loginUrl = url.replace(/\/qrcode\//, '/l/');
            QrcodeTerminal.generate(loginUrl);
        }
        console.log(`${url}\n[${code}] Scan QR Code in above url to login: `);
    })
	.on('heartbeat', (data) => {
		console.log('heartbeat...')
	})
    .on('login', user => {
    	let msg = `${user.name()} logined`

    	log.info('Bot', msg)
    	bot.say(msg)

    	Room.find({topic: '/hhf/i'})
            	.then(dingRoom =>{
            		console.log('打到聊天室', dingRoom.topic())


            		dingRoom
	            		.on('join', (contacts, contact) => {
		            		console.log(contact.name(), '来了')
		            	})
		            	.on('leave', (contacts, contact) => {
		            		console.log(contact.name(), '走了')	
		            	})
		            	.on('topic', (topic, oldTopic, contact) => {
		            		console.log('标题',topic, '改为', 'oldTopic');
		            	})
            	})
            	

    	// console.log('Bot', `bot login: ${user}`)


    })
    .on('logout', e => console.log('Bot', 'bot logout.'))
    .on('message', m => {
		
    	// bot.say()
    	// message.say()
    	// contact.say()


    	const room = m.room();

    	/*
    		room 为群聊天室，一对一聊天是不存在room
    		room.topic() 为群聊标题，默认情况下为未命名，也就是为空，系统不接受修改后的标题
    		room.name // 
    	*/

    	console.log((room ? '[' + room.topic() + ']' : '')
              + '<' + m.from().name() + '>'
              + ':' + m.toStringDigest()
		)

        if (m.self()) {
            return;
        }

        // m.say('roger'); // 直接回复

        
        // console.log(room.nick(m.from()), room.nick(m.to()))
        if (room && /Wechaty/i.test(room.topic())) {
            console.log(room.topic());
        }
        else {
            // console.log('Bot', 'recv: %s', m);
            var fromContact = m.from(),
            	toContact = m.to(),
            	content = m.content(),
            	type = m.type();



            console.log('消息来自：',fromContact.name())
            console.log('联系人备注：', fromContact.remark())
            console.log('联系人微信号：', fromContact.weixin())
            console.log('是否是星标朋友：', fromContact.star())
            console.log('内容：', content)

        if(fromContact.weixin() !== 'Cyndiq90') return;
            
            if(/ding/i.test(content)) {
            	Room.find({topic: '/hhf/i'})
            	.then(dingRoom =>{
				  //Room Operation
				  	dingRoom&&dingRoom.add(m.from())
				  	// dingRoom&&dingRoom.del(contact):void
				  	// dingRoom&&dingRoom.topic():string
				  	// dingRoom&&dingRoom.nick(contact):string
				  	// dingRoom&&dingRoom.has(contact):boolean
				  	// dingRoom&&dingRoom.owner():contact||null
				  	// dingRoom&&dingRoom.member(name):contact
				  	// dingRoom&&dingRoom.memberList():contact[]

				  	dingRoom&&dingRoom.refresh();
				})
            }

            m.to(m.from())
            
            if(m.type() === MsgType.IMAGE) {
            	// m.content('图片')
            	// bot.send(m)
            	m.say('图片')
                // m.content('<img src="http://img02.nduoa.com/apk/732/732247/0.watermark.jpg"/>')
                // bot.send(m)
            } else if(m.type() === MsgType.EMOTICON) {
            	// m.content('表情')
            	// bot.send(m)
            	m.say('表情')
            } else if(m.type() === MsgType.VIDEO) {
            	// m.content('视频')
            	// bot.send(m)
            	m.say('视频')
            } else if(m.type() === MsgType.VOICE) {
            	// m.content('音频')
            	// bot.send(m)
            	m.say('音频')
                // m.say('<a href="https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxgetvoice?msgid=8305704163268721723&skey=@crypt_541dddba_bf6f0ce4d706e5d017ba612354c38a4f">音频2</a>');
                // console.log(m)
                // tuling.send({
                //   userid: 1,
                //   info: m.content(),
                //   // loc: '南京市'
                // }).then(function(result) {
                //     // {code: 10000, text:''}
                //   console.log(result);

                //   m.say(result.text)
                // })
            } else if(m.type() === MsgType.SYS) {
            	// m.content('系统')
            	// bot.send(m)
            	m.say('系统')
            } else if(m.type() === MsgType.SHARECARD) {
            	// m.content('名片')
            	// bot.send(m)
            	m.say('名片')
            } else if(m.type() === MsgType.TEXT) {
            	// m.content('文字类型')
            	// bot.send(m)
            	console.log(m)
                tuling.send({
                  userid: 1,
                  info: m.content(),
                  // loc: '南京市'
                }).then(function(result) {
                    // {code: 10000, text:''}
                  console.log(result);

                  m.say(result.text+' '+result.url)
                })

            } else if(m.type() === MsgType.LOCATION) {
            	m.content('位置')
            	bot.send(m)
            } else if(m.type() === MsgType.MICROVIDEO) {
            	m.content('小视频')
            	bot.send(m)
            } else if(m.type() === MsgType.VERIFYMSG) {
            	m.content('收到添加好友验证信息')
            	bot.send(m)
            } else if(m.type() === MsgType.APP) {
            	m.content('App')
            	bot.send(m)
            } else if(m.type() === MsgType.VOIPMSG) {
            	m.content('视频聊天')
            	bot.send(m)
            } else if(m.type() === MsgType.STATUSNOTIFY) {
            	m.content('状态提示')
            	bot.send(m)
            } else if(m.type() === MsgType.VOIPNOTIFY) {
            	m.content('语音提示')
            	bot.send(m)
            } else if(m.type() === MsgType.SYSNOTICE) {
            	m.content('系统提示')
            	bot.send(m)
            } else if(m.type() === MsgType.RECALLED) {
            	m.content('收藏')
            	bot.send(m)
            } else if(m.type() === MsgType.POSSIBLEFRIEND_MSG) {
            	m.content('好友信息')
            	bot.send(m)
            } else {
            	m.content('其它')
            	bot.send(m)
            }


			// const request = new FriendRequest()
			// request.send(fromContact, 'hello~')
 
            // m.to(m.from())
            // bot.send(m)
        }
    })
    .on('friend', (contactName, request) => {
    	console.log('friend...')
    	if(request) {
    		if(request.hello === '自动验证标识') {
    			request.accept()
    			console.log('自动接受加好友请求')
    		}
    		
    	} else {
    		console.log('接受好友请求：' + contactName)
    	}
    })
    .on('room-join', (room, contacts, contact) => {
    	const nameList = contacts.map(c => c.name()).join(',')
  		console.log(`Room ${room.topic()} got new member ${nameList}, invited by ${contact}`)
    })
    .on('room-leave', (room, contacts) => {
    	const nameList = contacts.map(c => c.name()).join(',')
  		console.log(`Room ${room.topic()} lost member ${nameList}`)
    })
    .on('room-topic', (room, topic, oldTopic, contact) => {
    	console.log(`Room ${room.topic()} topic changed from ${oldTopic} to ${topic} by ${contact.name()}`)
    })
    .on('error', err => {

    });

bot.init()
    .catch(e => {
        console.log('Bot', 'init() fail:' + e);
        bot.quit();
        process.exit(-1);
    });


function saveMediaFile(message) {
  const filename = message.filename()
  console.log('IMAGE local filename: ' + filename)

  const fileStream = createWriteStream(filename)

  console.log('start to readyStream()')
  message.readyStream()
          .then(stream => {
            stream.pipe(fileStream)
                  .on('close', () => {
                    console.log('finish readyStream()')
                  })
          })
          .catch(e => console.log('stream error:' + e))
}

var room1 = new Room();

room1.on('join', (contacts, contact) => {
	console.log('Room join')
})

room1.on('leave', (contacts) => {
	console.log('Room leave')
})

room1.on('topic', (topic, oldTopic, contact) => {
	console.log('Room topic')
})

/*

Wechaty Event

scan Emit when the bot needs to show you a QR Code for scanning
login Emit when bot login full successful.
logout Emit when bot detected log out.
message Emit when there's a new message.
error Emit when there's an error occurred.
friend Emit when got a new friend request, or friendship is confirmed.
room-join Emit when someone join the room
room-leave Emit when someone leave the room
room-topic Emit when someone change the room's topic


Wechaty

instance(setting: PuppetSetting): Promise<Wechaty> get the bot instance
init(): Promise<void> Initialize the bot
send(message: Message): Promise<void> send a message
say(content: string): Promise<void> send message to filehelper, just for logging/reporting usage for your convenience


Message

from():Contact get the sender from a message
from(contact:Contact):void set a sender to the message
to():Contact get the destination of the message
to(contact:Contact):void set the destination as contact for the message
content():string get the content of the message
content(content:string):string set the content for the message
room():Room|null get the room from a message.
room(room:Room):void set the room for a message.
type():MsgType get the type of a Message.
say(content:string):Promise reply a message to the sender.
ready():Promise confirm get all the data needed, will be resolved when all message data is ready.
self():boolean check if a message is sent by self


Contact

name():string get name from a contact
remark():string get remark name from a contact
remark(remark:string):Promise set remark name to a contact
weixin():string get weixin id from a contact
star():boolean true for star friend, false for no star friend
ready():Promise confirm get all the contact data needed, will be resolved when all data is ready
say(content:string):Promise say content to a contact


Room

say(content:string,replyTo:Contact|ContactArray):Promise say content inside Room.
ready():Promise confirm get all the data needed, will be resolved when all data is ready
refresh():Promise reload data for Room


Room Event

join Emit when someone join the room
leave Emit when someone leave the room
topic Emit when someone change the room topic


FriendRequest

hello:string get content from friendrequest
accept():void accept the friendrequest
send(contact:Contact,hello:string):void send a new friend request

*/
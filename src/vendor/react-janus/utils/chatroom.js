// import Janus from './janus';
let chatroomHandler;

export function publishChatroom(
  janus,
  opaqueId,
  isPublisher,
  chatroomId,
  username,
  display,
  callback
) {
  if (!janus) {
    return;
  }

  janus.attach({
    plugin: 'janus.plugin.textroom',
    opaqueId: opaqueId,
    success: function (pluginHandle) {
      chatroomHandler = pluginHandle;
      // Janus.log("Plugin attached! (" + chatroomHandler.getPlugin() + ", id=" + chatroomHandler.getId() + ")");

      var body = { request: 'setup' };
      chatroomHandler.send({ message: body });
    },
    error: function (error) {
      console.error('  -- Error attaching plugin...', error);
    },
    webrtcState: function (on) {
      // // Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
    },
    onmessage: function (msg, jsep) {
      // Janus.debug(" ::: Got a message :::");
      // Janus.debug(msg);
      if (msg['error'] !== undefined && msg['error'] !== null) {
        //todo error
      }
      if (jsep !== undefined && jsep !== null) {
        // Answer
        chatroomHandler.createAnswer({
          jsep: jsep,
          media: { audio: false, video: false, data: true }, // We only use datachannels
          success: function (jsep) {
            // Janus.debug("Got SDP!");
            // Janus.debug(jsep);
            var request = { request: 'ack' };
            chatroomHandler.send({ message: request, jsep: jsep });
          },
          error: function (error) {
            // Janus.error("WebRTC error:", error);
          },
        });
      }
    },
    ondataopen: function (data) {
      // Janus.log("The DataChannel is available!");
      if (isPublisher) {
        const request = {
          request: 'create',
          room: chatroomId,
        };
        chatroomHandler.send({
          message: request,
          success: (data) => {
            callback(chatroomHandler, 'created', chatroomId);

            const request = {
              textroom: 'join',
              transaction: randomString(12),
              room: chatroomId,
              username: username,
              display: display,
            };
            chatroomHandler.data({
              text: JSON.stringify(request),
              success: (data) => {
                console.log('Publisher joined');
                callback(chatroomHandler, 'joined');
              },
            });
          },
        });
      } else {
        const request = {
          textroom: 'join',
          transaction: randomString(12),
          room: chatroomId,
          username: username,
          display: display,
        };
        chatroomHandler.data({
          text: JSON.stringify(request),
          success: (data) => {
            console.log('Subscriber joined');
            callback(chatroomHandler, 'joined');
          },
        });
      }
    },
    ondata: function (data) {
      // Janus.debug("We got data from the DataChannel! ");

      const json = JSON.parse(data);
      const event = json['textroom'];

      switch (event) {
        case 'success':
        case 'message':
        case 'announcement':
        case 'join':
        case 'leave':
        case 'kicked':
        case 'destroyed':
        default:
          callback(chatroomHandler, event, json);
          break;
      }
    },
    oncleanup: function () {
      // Janus.log(" ::: Got a cleanup notification :::");
    },
  });
}

export function randomString(len, charSet) {
  charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var randomString = '';
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}

export function sendData(chatroom, data, event = 'message') {
  var message = {
    textroom: event,
    transaction: randomString(12),
    room: chatroom,
    text: data,
    ack: false,
  };
  // Note: messages are always acknowledged by default. This means that you'll
  // always receive a confirmation back that the message has been received by the
  // server and forwarded to the recipients. If you do not want this to happen,
  // just add an ack:false property to the message above, and server won't send
  // you a response (meaning you just have to hope it succeeded).
  chatroomHandler.data({
    text: JSON.stringify(message),
    error: function (reason) { },
    success: function () { },
  });
}

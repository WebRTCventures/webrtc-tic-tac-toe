import Janus from './janus';

export function subscribeRemoteFeed(
  janus,
  opaqueId,
  room,
  id,
  pvtId,
  display,
  audio,
  video,
  callback
) {
  let remoteFeed = null;
  let remoteFeedIndex = id;
  if (!opaqueId) opaqueId = Math.floor(Math.random() * 10000);
  janus.attach({
    plugin: 'janus.plugin.videoroom',
    opaqueId: opaqueId,
    success: function (pluginHandle) {
      remoteFeed = pluginHandle;
      remoteFeed.simulcastStarted = false;
      Janus.log('Plugin attached! (' + remoteFeed.getPlugin() + ', id=' + remoteFeed.getId() + ')');
      Janus.log('  -- This is a subscriber');

      var subscribe = {
        request: 'join',
        room: room,
        ptype: 'subscriber',
        feed: id,
        private_id: pvtId,
        // "data": true
      };

      if (
        Janus.webRTCAdapter.browserDetails.browser === 'safari' &&
        (video === 'vp9' || (video === 'vp8' && !Janus.safariVp8))
      ) {
        if (video) video = video.toUpperCase();
        subscribe['offer_video'] = false;
      }
      remoteFeed.videoCodec = video;
      remoteFeed.send({ message: subscribe });
    },
    error: function (error) {
      Janus.error('  -- Error attaching plugin...', error);
      callback(remoteFeed, remoteFeedIndex, 'error', error);
    },
    onmessage: function (msg, jsep) {
      Janus.debug(' ::: Got a message (subscriber) :::');
      Janus.debug(msg);

      if (jsep !== undefined && jsep !== null) {
        Janus.debug('SUBS: Handling SDP as well...');
        Janus.debug(jsep);
        // Answer and attach
        remoteFeed.createAnswer({
          jsep: jsep,
          // Add data:true here if you want to subscribe to datachannels as well
          // (obviously only works if the publisher offered them in the first place)
          media: { audioSend: false, videoSend: false }, // We want recvonly audio/video
          success: function (jsep) {
            Janus.debug('Got SDP!');
            Janus.debug(jsep);
            var body = { request: 'start', room: room };
            remoteFeed.send({ message: body, jsep: jsep });
          },
          error: function (error) {
            Janus.error('WebRTC error:', error);
          },
        });
      }
    },
    webrtcState: function (on) {
      Janus.log(
        'Janus says this WebRTC PeerConnection (feed #' +
          remoteFeed.rfindex +
          ') is ' +
          (on ? 'up' : 'down') +
          ' now'
      );
    },
    onlocaltrack: function (stream) {
      // The subscriber stream is recvonly, we don't expect anything here
    },
    onremotetrack: function (stream) {
      callback(remoteFeed, remoteFeedIndex, 'onremotetrack', stream);
    },
    oncleanup: function () {
      callback(remoteFeed, remoteFeedIndex, 'oncleanup');
    },
  });
  return remoteFeed;
}

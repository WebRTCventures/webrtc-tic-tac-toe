import Janus from './janus';

/**
 * Method to display a selection of the available devices and choose them
 *
 * @param sfutest is the Janus publisher handler
 * @param config object that includes the types of devices we want to list
 * @param callback - cb
 */
export function initDeviceSelection(sfutest, config, cb) {
  if (!sfutest) {
    return;
  }

  Janus.listDevices((devices) => {
    try {
      document.getElementById('devices').classList.remove('hide');
      document.getElementById('devices').parentElement.classList.remove('hide');
      document.querySelectorAll('#audio-device, #video-device').forEach((element) => {
        element.removeAttribute('option');
      });
      try {
        devices.forEach(function (device) {
          var label = device.label;
          if (!label || label === '') label = device.deviceId;
          var option = '<option value="' + device.deviceId + '">' + label + '</option>';
          if (device.kind === 'audioinput') {
            document.getElementById('audio-device').innerHTML =
              document.getElementById('audio-device').innerHTML + option;
          } else if (device.kind === 'videoinput') {
            document.getElementById('video-device').innerHTML =
              document.getElementById('video-device').innerHTML + option;
          }
        });
      } catch (err) {
        throw new Error(`Failed parsing device error: ${JSON.stringify(err)}`);
      }
      cb();
    } catch (e) {
      throw new Error('Failed to initialize video/audio devices. Error:' + JSON.stringify(e));
    }
  }, config);
}

export function restartCapture(sfutest, latestAudioDevice, latestVideoDevice, cb) {
  let body = { request: 'configure', audio: true, video: true };
  Janus.debug('Sending message:', body);
  sfutest.send({ message: body });
  Janus.debug('Trying a createOffer too (audio/video sendrecv)');
  sfutest.createOffer({
    // We provide a specific device ID for both audio and video
    media: {
      audio: {
        deviceId: {
          exact: latestAudioDevice,
        },
      },
      replaceAudio: true, // This is only needed in case of a renegotiation
      video: {
        deviceId: {
          exact: latestVideoDevice,
        },
      },
      replaceVideo: true, // This is only needed in case of a renegotiation
    },
    success: function (jsep) {
      Janus.debug('Got SDP!', jsep);
      sfutest.send({ message: body, jsep: jsep });
      cb(null, { modifiedAudio: true, modifiedVideo: true, jsep: jsep });
    },
    error: function (error) {
      Janus.error('WebRTC error:', error);
      cb(error);
    },
  });
}

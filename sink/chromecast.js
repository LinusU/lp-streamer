'use strict'

var Client = require('castv2-client').Client
var DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver

var chromecastIp = '10.0.1.160'
var chromecastPort = 8009

module.exports = function streamToChromecast (url) {
  var client = new Client()

  client.connect(chromecastIp, function () {
    client.launch(DefaultMediaReceiver, function (err, player) {
      if (err) throw err

      var media = {
        // contentId: 'http://' + os.hostname() + '.local:3000/',
        contentId: url,
        contentType: 'audio/mpeg3',
        streamType: 'BUFFERED'
      }

      player.on('status', function (status) {
        console.log('status broadcast playerState=%s', status.playerState)
      })

      player.load(media, { autoplay: true }, function (err, status) {
        if (err) throw err

        console.log('status broadcast playerState=%s', status.playerState)
      })
    })
  })
}

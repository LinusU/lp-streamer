'use strict'

var os = require('os')
var url = require('url')
var net = require('net')
var sonos = require('sonos')
var Nicercast = require('nicercast')
var interfaceForIp = require('interface-for-ip')

module.exports = function streamToSonos (stream) {
  var server = new Nicercast(stream, { metadata: 'LP Streamer' })

  server.listen(0, function () {
    var localPort = server.address().port

    sonos.search(function (client, type) {
      if (type === 'BR100') return

      console.log('[sonos] Found device of type: ' + type)

      var iface = interfaceForIp(client.host)
      var sonosUrl = url.format({
        protocol: 'x-rincon-mp3radio',
        slashes: true,
        hostname: iface.address,
        port: localPort,
        pathname: '/listen.m3u'
      })

      console.log('[sonos] Sending play command with url: ', sonosUrl)
      client.play(sonosUrl, function (err, playing) {
        if (err) throw err

        console.log('[sonos] Device playing state: %s', playing)
      })
    })
  })
}

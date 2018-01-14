#!/usr/bin/env node

const os = require('os')
const url = require('url')

const audioHidEvents = require('audio-hid-events')
const express = require('express')

const platform = require('./platform/linux-alsa')

const settings = {
  passThrough: true,
  source: true
}

const app = express()

if (settings.passThrough) {
  platform.startPassThrough()

  audioHidEvents.on('volume-up', () => {
    console.log('Volume up')
    platform.volumeUp()
  })

  audioHidEvents.on('volume-down', () => {
    console.log('Volume down')
    platform.volumeDown()
  })

  audioHidEvents.on('mute', () => {
    console.log('Toggle mute')
    platform.toggleMute()
  })
}

if (settings.source) {
  app.get('/listen.m3u', (req, res) => {
    const urlProps = { protocol: 'http', pathname: '/listen' }

    if (req.headers.host) {
      urlProps.host = req.headers.host
    } else {
      const info = req.socket.address()
      urlProps.hostname = info.address
      urlProps.port = info.port
    }

    res.writeHead(200, { 'Content-Type': 'audio/x-mpegurl' })
    res.end(url.format(urlProps))
  })

  app.get('/listen', (req, res) => {
    res.set('Connection', 'close')
    res.set('Content-Type', 'audio/mpeg')

    const { stream, stop } = platform.streamMP3()

    res.on('close', () => stop())
    stream.pipe(res)
  })
}

app.get('/', (req, res) => res.send(`<h1>LP Streamer</h1><p>Pass through: ${settings.passThrough ? 'on' : 'off'}</p><p>Source: ${settings.source ? 'on' : 'off'}</p>`))

app.listen(80, () => {
  console.log(`http://${os.hostname()}.local/listen.m3u`)
})

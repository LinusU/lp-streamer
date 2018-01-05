#!/usr/bin/env node

const os = require('os')
const { spawn } = require('child_process')
const Nicercast = require('nicercast')

const input = spawn('parec', ['--raw', '--latency=8820']).stdout
const server = new Nicercast(input, { metadata: 'LP Streamer' })

// Switch stream to flowing mode, as to not buffer audio data until the first client connects
input.resume()

server.listen(80, () => {
  console.log(`http://${os.hostname()}/listen.m3u`)
})

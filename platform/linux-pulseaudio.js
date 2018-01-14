const { spawn } = require('child_process')
const treeKill = require('tree-kill')

exports.startPassThrough = () => {
  spawn('sh', ['-c', 'parec --raw | paplay --raw'], { stdio: ['ignore', 'ignore', 'inherit'] })
}

exports.volumeUp = () => {
  spawn('sh', ['-c', 'pactl set-sink-mute 0 false ; pactl set-sink-volume 0 +5%'], { stdio: ['ignore', 'ignore', 'inherit'] })
}

exports.volumeDown = () => {
  spawn('sh', ['-c', 'pactl set-sink-mute 0 false ; pactl set-sink-volume 0 -5%'], { stdio: ['ignore', 'ignore', 'inherit'] })
}

exports.toggleMute = () => {
  spawn('sh', ['-c', 'pactl set-sink-mute 0 toggle'], { stdio: ['ignore', 'ignore', 'inherit'] })
}

exports.streamMP3 = () => {
  const child = spawn('sh', ['-c', 'parec --raw --latency=8820 | lame -r -s 44.1 -'], { stdio: ['ignore', 'pipe', 'inherit'] })

  const stop = () => {
    treeKill(child.pid, (err) => {
      if (err) console.log(err.stack || err)
    })
  }

  return { stream: child.stdout, stop }
}

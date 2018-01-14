const { spawn } = require('child_process')
const treeKill = require('tree-kill')

exports.startPassThrough = () => {
  spawn('alsaloop', ['-t', '500000', '-C', 'hw:1,0', '-P', 'hw:1,0'], { stdio: ['ignore', 'ignore', 'inherit'] })
}

exports.volumeUp = () => {
  spawn('amixer', ['-c', '1', 'sset', 'PCM', '5%+', 'on'], { stdio: ['ignore', 'ignore', 'inherit'] })
}

exports.volumeDown = () => {
  spawn('amixer', ['-c', '1', 'sset', 'PCM', '5%-', 'on'], { stdio: ['ignore', 'ignore', 'inherit'] })
}

exports.toggleMute = () => {
  spawn('amixer', ['-c', '1', 'sset', 'PCM', 'toggle'], { stdio: ['ignore', 'ignore', 'inherit'] })
}

exports.streamMP3 = () => {
  const child = spawn('sh', ['-c', 'arecord -D hw:1,0 -t raw -c 2 -f S16_LE -r 44100 -B 500000 | lame -r -s 44.1 -'], { stdio: ['ignore', 'pipe', 'inherit'] })

  const stop = () => {
    treeKill(child.pid, (err) => {
      if (err) console.log(err.stack || err)
    })
  }

  return { stream: child.stdout, stop }
}

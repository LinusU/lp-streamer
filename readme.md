# LP Streamer

Stream your Vinyl LP player to your wireless speakers.

## Installation on Raspberry Pi

Download the latest Raspian image from [raspberrypi.org](https://www.raspberrypi.org/downloads/) and flash it to an empty sd-card.

Create an empty file `ssh` on the boot partition, and configure your wlan credentials by creating a `wpa_supplicant.conf` file:

```text
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=US

network={
  ssid="The name of my WiFi"
  psk="your-network-WPA/WPA2-security-passphrase"
  key_mgmt=WPA-PSK
}
```

If your wifi doesn't have a password, switch the `network=` part to:

```text
network={
  ssid="The name of my WiFi"
  key_mgmt=NONE
}
```

### Install prerequisites

```sh
sudo apt-get install git pulseaudio
```

### Install Node.js

```sh
curl -L https://nodejs.org/dist/v8.9.4/node-v8.9.4-linux-armv6l.tar.gz | sudo tar xz --strip-components=1 -C /usr
```

### Let Node.js bind to port 80 without root

```sh
sudo setcap CAP_NET_BIND_SERVICE=+eip /usr/bin/node
```

### Install LP Streamer

Clone this repo into `/home/pi/lp-streamer`, install dependencies and link in the service file.

```sh
# Clone the repo
git clone https://github.com/LinusU/lp-streamer.git

# Move into the cloned folder
cd lp-streamer

# Install dependencies, this might take a while
npm install

# Link the SystemD service file
sudo ln -s /home/pi/lp-streamer/lp-streamer.service /etc/systemd/system/lp-streamer.service
```

### Start the service

```sh
sudo systemctl daemon-reload
sudo systemctl enable lp-streamer
sudo systemctl start lp-streamer
```

The service should now start automaticallt whenever the pi is rebooted.

### Start listening 🚀

Open up [http://raspberry.local/listen.m3u](http://raspberry.local/listen.m3u) with your favourite audio player.

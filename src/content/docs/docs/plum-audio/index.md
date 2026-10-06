---
title: Get started with Plum Audio
description: Set up one Raspberry Pi as a Plum Audio unit.
sidebar:
  label: Get started
  order: 1
---

Plum Audio turns Raspberry Pis into a synchronized multi-room audio system. This guide sets
up one unit from the Pi itself. To deploy several units from a workstation, follow the
fleet guide in the [repository README](https://github.com/AnotherMike-exe/Plum-Audio#a-fleet-from-your-workstation).

## Requirements

- A **Raspberry Pi 4** or newer with **Raspberry Pi OS Lite, 64-bit, Debian 13**.
- Docker with **host networking**. Units find each other with mDNS, so they must be on the
  same subnet.
- An audio output: the 3.5 mm jack, a HAT, or a USB DAC. A unit without one still works as a
  source and routing node.
- Internet access for the first install, to get Docker and the image.

## 1. Prepare the Pi

Flash Raspberry Pi OS Lite with Raspberry Pi Imager. In Imager:

- Enable SSH and create a user.
- Give each unit a **unique hostname**. The unit takes its identity from it, and two units
  with the same hostname break each other's routing.
- Set up WiFi if the unit has no ethernet.

Give the unit a static address or a DHCP reservation.

## 2. Run the installer

On the Pi:

```bash
curl -fsSLO https://raw.githubusercontent.com/AnotherMike-exe/Plum-Audio/main/scripts/plum-init.sh
chmod +x plum-init.sh
sudo ./plum-init.sh "Kitchen"
```

Replace `Kitchen` with the name of the room. Allow about 10 minutes on a fresh card. Add
`--check` to see a report of the host without changing anything.

## 3. Keep the fleet secret

The first unit prints a **fleet pairing secret**. Every other unit needs the same value, or
the units cannot pair with each other's speakers:

```bash
sudo ./plum-init.sh "Living Room" --fleet-psk <the secret the first unit printed>
```

If you lose it, copy it from any running unit:

```bash
sudo ./plum-init.sh "Bedroom" --fleet-psk-from 192.0.2.10
```

## 4. Open the unit

Go to `http://<unit-ip>/`. Add your sources under **Settings → Integrations**. The audio
output is chosen for you; change it under **Settings → Audio**.

A new unit offers AirPlay only. Spotify Connect and Bluetooth stay off until you set them up.

## Next

- Audio HATs need two extra steps with a reboot between them. See the
  [repository README](https://github.com/AnotherMike-exe/Plum-Audio#one-pi-from-the-pi-itself).
- [Source code and issues on GitHub](https://github.com/AnotherMike-exe/Plum-Audio)

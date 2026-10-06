---
title: Plum Audio
summary: Synchronized multi-room audio for Raspberry Pi, with AirPlay, Spotify Connect and Bluetooth on every unit.
status: Available
kind: Software
platform: Raspberry Pi 4 or newer, Docker
repo: https://github.com/AnotherMike-exe/Plum-Audio
docs: /docs/plum-audio/
order: 1
---

Plum Audio turns a set of Raspberry Pis into one multi-room audio system. Each unit is
a receiver and a speaker. It accepts AirPlay, Spotify Connect and Bluetooth, and any
source can play on any set of speakers, in any combination, at the same time.

Send AirPlay to the kitchen while Spotify plays in the living room, then move the
kitchen speaker into the living room group. Neither stream stops. There is no central
server: every unit runs its own, and units find each other on the local network.

## What it does

- **Synchronized playback** across units, using the open
  [Sendspin](https://www.sendspin-audio.com/spec/) protocol.
- **Groups** with volume for each speaker, each group and each source.
- **A web interface on every unit**, with now playing, album art and a spectrum
  visualizer.
- **Works with Music Assistant** and other Sendspin controllers, because each unit
  advertises itself as a standard Sendspin server and player.
- **One container per unit.** A unit without a sound card still works as a source and
  routing node.

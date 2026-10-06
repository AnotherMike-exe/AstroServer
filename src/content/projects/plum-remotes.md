---
title: Plum Remotes
summary: A rechargeable remote with a trackpad and voice, and a hub that connects it to Home Assistant, Android TV and Apple TV.
status: Design phase
kind: Hardware and firmware
platform: nRF52840, Home Assistant
docs: /docs/plum-remotes/
order: 3
---

Plum Remotes is a battery remote and the hub it talks to. The hub bridges the remote to
Home Assistant, Android TV and Apple TV, so one remote can drive the TV and the rest of
the room.

The remote is built around a certified nRF52840 radio module. The board adds a key
matrix, a trackpad, a microphone for voice, and an accelerometer that wakes the remote
when it is picked up. A switched power rail lets it sleep at about 26 µA, which is what
makes a charge last for months.

## Where it is

The hub board is fabricated and running firmware. The remote board is in its design
phase: requirements, parts and the radio link are being confirmed before the schematic
is drawn.

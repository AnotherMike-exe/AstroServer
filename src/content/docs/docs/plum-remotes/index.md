---
title: Plum Remotes status
description: Where the Plum Remotes hardware and firmware stand.
sidebar:
  label: Status
  order: 1
---

Plum Remotes is a rechargeable remote and a hub. The hub bridges the remote to Home
Assistant, Android TV and Apple TV. It is in its design phase: there is nothing to build or
buy yet.

## The two boards

| Board | State |
|---|---|
| Hub | Fabricated and running firmware |
| Remote | Design phase. Requirements and parts are being confirmed before the schematic is drawn |

## The remote

- A certified nRF52840 radio module, so the board needs no radio certification of its own.
- A key matrix, a trackpad, and a microphone for voice.
- An accelerometer that wakes the remote when you pick it up.
- A rechargeable LiPo cell. A switched power rail brings sleep current to about 26 µA, which
  is what makes a charge last for months.
- Space reserved for an e-paper display.

Build guides will be added here when the remote board is released.

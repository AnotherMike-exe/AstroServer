---
title: WiFi Serial Bridge status
description: Where the WiFi Serial Bridge hardware and firmware stand.
sidebar:
  label: Status
  order: 1
---

The WiFi Serial Bridge puts the console port of a switch or router on WiFi. It is in
development: the prototype works, and the board is not fabricated yet.

## Where it is

| Stage | State |
|---|---|
| Breadboard prototype | Working |
| Schematic | Drawn and reviewed |
| Board layout | Routed and reviewed |
| Fabrication package | Next |

## The board

- An ESP32-C3 with its PCB antenna.
- An RS232 level shifter with surge protection on each connector.
- An 18650 cell, charged over USB-C, with cell protection.
- The console port on an RJ45, a 3-pin screw terminal and a 3.5 mm jack, with the same signals
  on each.

## Console cable

The RJ45 uses the Cisco console pinout, seen from the equipment side. Use a
**straight-through** cable to the console port. A Cisco rollover cable does not work.

Build guides will be added here when the board is released.

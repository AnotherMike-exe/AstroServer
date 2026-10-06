---
title: WiFi Serial Bridge
summary: A pocket-sized, battery-powered bridge that puts the console port of a switch or router on WiFi.
status: In development
kind: Hardware and firmware
platform: ESP32-C3
docs: /docs/wifi-serial-bridge/
order: 4
---

The WiFi Serial Bridge plugs into the console port of network equipment and makes it
reachable over WiFi. You can configure a switch or a router from a laptop or a phone
across the room, with no USB-serial adapter and no cable to the rack.

It runs from a rechargeable 18650 cell and charges over USB-C. The console port is on
an RJ45 with the Cisco console pinout, with the same signals on a screw terminal and a
3.5 mm jack for equipment that uses those instead.

## Where it is

A breadboard prototype works. The board replaces it: the schematic is reviewed and the
layout is routed. The fabrication package is next.

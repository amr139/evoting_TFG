#!/bin/sh
journalctl -u web1 -e -f --since today

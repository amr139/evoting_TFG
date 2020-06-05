#!/bin/bash
docker logs $(docker ps | grep "dev-peer0.org1" | awk '{ print $1 }')

#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
set -e

# clean out any old identites in the wallets
sudo rm -rf javascript/wallet/*

# launch network; create channel and join peer to channel
pushd ./network
./network.sh down
./network.sh up createChannel -ca -s couchdb
./network.sh deployCC -l javascript
popd

/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');


async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);


        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('tester');
        if (!identity) {
            console.log('An identity for the user "tester" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'tester', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('canal');

        // Get the contract from the network.
        const contract = network.getContract('evoting');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        var partido = ["PSOE", "PP", "VOX", "UP", "Cs", "ERC", "JxCAT", "PNV", "EHB", "MP", "CUP", "CCa", "Na+", "BNG", "PRC", "TE"]
        var distrito = ["Andalucia", "Aragon", "Asturias", "Baleares", "Canarias", "Cantabria", "Castilla y leon", "Castilla la mancha", "Catalunya", "Comunidad valenciana", "Extremadura", "Galicia", "Madrid", "Murcia", "Navarra", "Pais vasco", "Rioja", "Ceuta", "Melilla"];

        const MAX = 999;
        for (var i = 1; i <= MAX; i++) {

            var indexPartido = Math.floor(Math.random()*16);
            var indexDistrito = Math.floor(Math.random()*19);
            const respuesta = await contract.submitTransaction('addVote', i.toString() + 'SL', partido[indexPartido], distrito[indexDistrito]);
            var obj = JSON.parse(respuesta.toString());

            if (Object.keys(obj).length = 2 && obj.result == true) {
                console.log(i + ": pasado");
            } else {
                console.log(JSON.stringify(obj));
                //break;
            }
        }

        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }

}

main();

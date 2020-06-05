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
        const ccpPath = path.resolve(__dirname, '..',  'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
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
        const respuesta = await contract.submitTransaction('queryVoter', '53249556W');
        const esperado = '{"result":false,"data":"Votante no encontrado"}';

        if(process.argv[2] == "-v") {
            console.log(respuesta.toString(),esperado)
        }

        if(respuesta.toString() == esperado) {
            console.log("TEST 0: SUPERADO");
        }else {
            console.log("TEST 0: ERROR");
        }
        await gateway.disconnect();


    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }

    
}

main();

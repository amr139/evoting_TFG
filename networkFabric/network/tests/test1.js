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
        const respuesta = await contract.evaluateTransaction('queryAllBallots');
        const esperado = '{"result":true,"data":[{"region":"Andalucia","nombreCorto":"AND","opciones":[{"nombre":"PSOE","contador":0},{"nombre":"PP","contador":0},{"nombre":"VOX","contador":0},{"nombre":"UP","contador":0},{"nombre":"Cs","contador":0},{"nombre":"ERC","contador":0},{"nombre":"JxCAT","contador":0},{"nombre":"PNV","contador":0},{"nombre":"EHB","contador":0},{"nombre":"MP","contador":0},{"nombre":"CUP","contador":0},{"nombre":"CCa","contador":0},{"nombre":"Na+","contador":0},{"nombre":"BNG","contador":0},{"nombre":"PRC","contador":0},{"nombre":"TE","contador":0}]},{"region":"Aragon","nombreCorto":"ARA","opciones":[{"nombre":"PSOE","contador":0},{"nombre":"PP","contador":0},{"nombre":"VOX","contador":0},{"nombre":"UP","contador":0},{"nombre":"Cs","contador":0},{"nombre":"ERC","contador":0},{"nombre":"JxCAT","contador":0},{"nombre":"PNV","contador":0},{"nombre":"EHB","contador":0},{"nombre":"MP","contador":0},{"nombre":"CUP","contador":0},{"nombre":"CCa","contador":0},{"nombre":"Na+","contador":0},{"nombre":"BNG","contador":0},{"nombre":"PRC","contador":0},{"nombre":"TE","contador":0}]},{"region":"Asturias","nombreCorto":"AST","opciones":[{"nombre":"PSOE","contador":0},{"nombre":"PP","contador":0},{"nombre":"VOX","contador":0},{"nombre":"UP","contador":0},{"nombre":"Cs","contador":0},{"nombre":"ERC","contador":0},{"nombre":"JxCAT","contador":0},{"nombre":"PNV","contador":0},{"nombre":"EHB","contador":0},{"nombre":"MP","contador":0},{"nombre":"CUP","contador":0},{"nombre":"CCa","contador":0},{"nombre":"Na+","contador":0},{"nombre":"BNG","contador":0},{"nombre":"PRC","contador":0},{"nombre":"TE","contador":0}]},{"region":"Baleares","nombreCorto":"BAL","opciones":[{"nombre":"PSOE","contador":0},{"nombre":"PP","contador":0},{"nombre":"VOX","contador":0},{"nombre":"UP","contador":0},{"nombre":"Cs","contador":0},{"nombre":"ERC","contador":0},{"nombre":"JxCAT","contador":0},{"nombre":"PNV","contador":0},{"nombre":"EHB","contador":0},{"nombre":"MP","contador":0},{"nombre":"CUP","contador":0},{"nombre":"CCa","contador":0},{"nombre":"Na+","contador":0},{"nombre":"BNG","contador":0},{"nombre":"PRC","contador":0},{"nombre":"TE","contador":0}]},{"region":"Canarias","nombreCorto":"CANA","opciones":[{"nombre":"PSOE","contador":0},{"nombre":"PP","contador":0},{"nombre":"VOX","contador":0},{"nombre":"UP","contador":0},{"nombre":"Cs","contador":0},{"nombre":"ERC","contador":0},{"nombre":"JxCAT","contador":0},{"nombre":"PNV","contador":0},{"nombre":"EHB","contador":0},{"nombre":"MP","contador":0},{"nombre":"CUP","contador":0},{"nombre":"CCa","contador":0},{"nombre":"Na+","contador":0},{"nombre":"BNG","contador":0},{"nombre":"PRC","contador":0},{"nombre":"TE","contador":0}]},{"region":"Cantabria","nombreCorto":"CANT","opciones":[{"nombre":"PSOE","contador":0},{"nombre":"PP","contador":0},{"nombre":"VOX","contador":0},{"nombre":"UP","contador":0},{"nombre":"Cs","contador":0},{"nombre":"ERC","contador":0},{"nombre":"JxCAT","contador":0},{"nombre":"PNV","contador":0},{"nombre":"EHB","contador":0},{"nombre":"MP","contador":0},{"nombre":"CUP","contador":0},{"nombre":"CCa","contador":0},{"nombre":"Na+","contador":0},{"nombre":"BNG","contador":0},{"nombre":"PRC","contador":0},{"nombre":"TE","contador":0}]},{"region":"Catalunya","nombreCorto":"CAT","opciones":[{"nombre":"PSOE","contador":0},{"nombre":"PP","contador":0},{"nombre":"VOX","contador":0},{"nombre":"UP","contador":0},{"nombre":"Cs","contador":0},{"nombre":"ERC","contador":0},{"nombre":"JxCAT","contador":0},{"nombre":"PNV","contador":0},{"nombre":"EHB","contador":0},{"nombre":"MP","contador":0},{"nombre":"CUP","contador":0},{"nombre":"CCa","contador":0},{"nombre":"Na+","contador":0},{"nombre":"BNG","contador":0},{"nombre":"PRC","contador":0},{"nombre":"TE","contador":0}]},{"region":"Ceuta","nombreCorto":"CEU","opciones":[{"nombre":"PSOE","contador":0},{"nombre":"PP","contador":0},{"nombre":"VOX","contador":0},{"nombre":"UP","contador":0},{"nombre":"Cs","contador":0},{"nombre":"ERC","contador":0},{"nombre":"JxCAT","contador":0},{"nombre":"PNV","contador":0},{"nombre":"EHB","contador":0},{"nombre":"MP","contador":0},{"nombre":"CUP","contador":0},{"nombre":"CCa","contador":0},{"nombre":"Na+","contador":0},{"nombre":"BNG","contador":0},{"nombre":"PRC","contador":0},{"nombre":"TE","contador":0}]},{"region":"Castilla la mancha","nombreCorto":"CLM","opciones":[{"nombre":"PSOE","contador":0},{"nombre":"PP","contador":0},{"nombre":"VOX","contador":0},{"nombre":"UP","contador":0},{"nombre":"Cs","contador":0},{"nombre":"ERC","contador":0},{"nombre":"JxCAT","contador":0},{"nombre":"PNV","contador":0},{"nombre":"EHB","contador":0},{"nombre":"MP","contador":0},{"nombre":"CUP","contador":0},{"nombre":"CCa","contador":0},{"nombre":"Na+","contador":0},{"nombre":"BNG","contador":0},{"nombre":"PRC","contador":0},{"nombre":"TE","contador":0}]},{"region":"Comunidad valenciana","nombreCorto":"CVA","opciones":[{"nombre":"PSOE","contador":0},{"nombre":"PP","contador":0},{"nombre":"VOX","contador":0},{"nombre":"UP","contador":0},{"nombre":"Cs","contador":0},{"nombre":"ERC","contador":0},{"nombre":"JxCAT","contador":0},{"nombre":"PNV","contador":0},{"nombre":"EHB","contador":0},{"nombre":"MP","contador":0},{"nombre":"CUP","contador":0},{"nombre":"CCa","contador":0},{"nombre":"Na+","contador":0},{"nombre":"BNG","contador":0},{"nombre":"PRC","contador":0},{"nombre":"TE","contador":0}]},{"region":"Castilla y leon","nombreCorto":"CYL","opciones":[{"nombre":"PSOE","contador":0},{"nombre":"PP","contador":0},{"nombre":"VOX","contador":0},{"nombre":"UP","contador":0},{"nombre":"Cs","contador":0},{"nombre":"ERC","contador":0},{"nombre":"JxCAT","contador":0},{"nombre":"PNV","contador":0},{"nombre":"EHB","contador":0},{"nombre":"MP","contador":0},{"nombre":"CUP","contador":0},{"nombre":"CCa","contador":0},{"nombre":"Na+","contador":0},{"nombre":"BNG","contador":0},{"nombre":"PRC","contador":0},{"nombre":"TE","contador":0}]},{"region":"Extremadura","nombreCorto":"EXT","opciones":[{"nombre":"PSOE","contador":0},{"nombre":"PP","contador":0},{"nombre":"VOX","contador":0},{"nombre":"UP","contador":0},{"nombre":"Cs","contador":0},{"nombre":"ERC","contador":0},{"nombre":"JxCAT","contador":0},{"nombre":"PNV","contador":0},{"nombre":"EHB","contador":0},{"nombre":"MP","contador":0},{"nombre":"CUP","contador":0},{"nombre":"CCa","contador":0},{"nombre":"Na+","contador":0},{"nombre":"BNG","contador":0},{"nombre":"PRC","contador":0},{"nombre":"TE","contador":0}]},{"region":"Galicia","nombreCorto":"GAL","opciones":[{"nombre":"PSOE","contador":0},{"nombre":"PP","contador":0},{"nombre":"VOX","contador":0},{"nombre":"UP","contador":0},{"nombre":"Cs","contador":0},{"nombre":"ERC","contador":0},{"nombre":"JxCAT","contador":0},{"nombre":"PNV","contador":0},{"nombre":"EHB","contador":0},{"nombre":"MP","contador":0},{"nombre":"CUP","contador":0},{"nombre":"CCa","contador":0},{"nombre":"Na+","contador":0},{"nombre":"BNG","contador":0},{"nombre":"PRC","contador":0},{"nombre":"TE","contador":0}]},{"region":"Madrid","nombreCorto":"MAD","opciones":[{"nombre":"PSOE","contador":0},{"nombre":"PP","contador":0},{"nombre":"VOX","contador":0},{"nombre":"UP","contador":0},{"nombre":"Cs","contador":0},{"nombre":"ERC","contador":0},{"nombre":"JxCAT","contador":0},{"nombre":"PNV","contador":0},{"nombre":"EHB","contador":0},{"nombre":"MP","contador":0},{"nombre":"CUP","contador":0},{"nombre":"CCa","contador":0},{"nombre":"Na+","contador":0},{"nombre":"BNG","contador":0},{"nombre":"PRC","contador":0},{"nombre":"TE","contador":0}]},{"region":"Melilla","nombreCorto":"MEL","opciones":[{"nombre":"PSOE","contador":0},{"nombre":"PP","contador":0},{"nombre":"VOX","contador":0},{"nombre":"UP","contador":0},{"nombre":"Cs","contador":0},{"nombre":"ERC","contador":0},{"nombre":"JxCAT","contador":0},{"nombre":"PNV","contador":0},{"nombre":"EHB","contador":0},{"nombre":"MP","contador":0},{"nombre":"CUP","contador":0},{"nombre":"CCa","contador":0},{"nombre":"Na+","contador":0},{"nombre":"BNG","contador":0},{"nombre":"PRC","contador":0},{"nombre":"TE","contador":0}]},{"region":"Murcia","nombreCorto":"MUR","opciones":[{"nombre":"PSOE","contador":0},{"nombre":"PP","contador":0},{"nombre":"VOX","contador":0},{"nombre":"UP","contador":0},{"nombre":"Cs","contador":0},{"nombre":"ERC","contador":0},{"nombre":"JxCAT","contador":0},{"nombre":"PNV","contador":0},{"nombre":"EHB","contador":0},{"nombre":"MP","contador":0},{"nombre":"CUP","contador":0},{"nombre":"CCa","contador":0},{"nombre":"Na+","contador":0},{"nombre":"BNG","contador":0},{"nombre":"PRC","contador":0},{"nombre":"TE","contador":0}]},{"region":"Navarra","nombreCorto":"NAV","opciones":[{"nombre":"PSOE","contador":0},{"nombre":"PP","contador":0},{"nombre":"VOX","contador":0},{"nombre":"UP","contador":0},{"nombre":"Cs","contador":0},{"nombre":"ERC","contador":0},{"nombre":"JxCAT","contador":0},{"nombre":"PNV","contador":0},{"nombre":"EHB","contador":0},{"nombre":"MP","contador":0},{"nombre":"CUP","contador":0},{"nombre":"CCa","contador":0},{"nombre":"Na+","contador":0},{"nombre":"BNG","contador":0},{"nombre":"PRC","contador":0},{"nombre":"TE","contador":0}]},{"region":"Pais vasco","nombreCorto":"PVA","opciones":[{"nombre":"PSOE","contador":0},{"nombre":"PP","contador":0},{"nombre":"VOX","contador":0},{"nombre":"UP","contador":0},{"nombre":"Cs","contador":0},{"nombre":"ERC","contador":0},{"nombre":"JxCAT","contador":0},{"nombre":"PNV","contador":0},{"nombre":"EHB","contador":0},{"nombre":"MP","contador":0},{"nombre":"CUP","contador":0},{"nombre":"CCa","contador":0},{"nombre":"Na+","contador":0},{"nombre":"BNG","contador":0},{"nombre":"PRC","contador":0},{"nombre":"TE","contador":0}]},{"region":"Rioja","nombreCorto":"RIO","opciones":[{"nombre":"PSOE","contador":0},{"nombre":"PP","contador":0},{"nombre":"VOX","contador":0},{"nombre":"UP","contador":0},{"nombre":"Cs","contador":0},{"nombre":"ERC","contador":0},{"nombre":"JxCAT","contador":0},{"nombre":"PNV","contador":0},{"nombre":"EHB","contador":0},{"nombre":"MP","contador":0},{"nombre":"CUP","contador":0},{"nombre":"CCa","contador":0},{"nombre":"Na+","contador":0},{"nombre":"BNG","contador":0},{"nombre":"PRC","contador":0},{"nombre":"TE","contador":0}]}]}';

        if (process.argv[2] == "-v") {
            console.log(respuesta.toString(), esperado)
        }

        if (respuesta.toString() == esperado) {
            console.log("TEST 1: SUPERADO");
        } else {
            console.log("TEST 1: ERROR");
        }
        process.exit(1);


    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }

}

main();

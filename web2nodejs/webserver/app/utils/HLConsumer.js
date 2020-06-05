'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

class HLConsumer {

    static async BeforeFunctions() {
        const ccpPath = path.resolve(__dirname, 'key', 'connection.json');
        this.ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        const walletPath = path.join(__dirname, 'key');
        this.wallet = await Wallets.newFileSystemWallet(walletPath);
    }

    static async IncluirVoto(dni, valor, distrito) {
        try {
            await this.BeforeFunctions();
            const gateway = new Gateway();
            await gateway.connect(this.ccp, { wallet: this.wallet, identity: 'webClient', discovery: { enabled: true, asLocalhost: true } });

            const network = await gateway.getNetwork('canal');
            const contract = network.getContract('evoting');

            const respuesta = await contract.submitTransaction('addVote', dni, valor, distrito);
            await gateway.disconnect();
            return JSON.parse(respuesta.toString());
        } catch (e) {
            return null;
        }

    }

    static async ComprobarSiHaVotado(dni) {
        try {
            await this.BeforeFunctions();
            const gateway = new Gateway();
            await gateway.connect(this.ccp, { wallet: this.wallet, identity: 'webClient', discovery: { enabled: true, asLocalhost: true } });

            const network = await gateway.getNetwork('canal');
            const contract = network.getContract('evoting');

            const respuesta = await contract.evaluateTransaction('queryVoter', dni);
            await gateway.disconnect();
            return JSON.parse(respuesta.toString());
        } catch (e) {
            return null;
        }
    }

    static async  ObtenerResultados() {
        try {
            await this.BeforeFunctions();
            const gateway = new Gateway();
            await gateway.connect(this.ccp, { wallet: this.wallet, identity: 'webClient', discovery: { enabled: true, asLocalhost: true } });

            const network = await gateway.getNetwork('canal');
            const contract = network.getContract('evoting');

            const respuesta = await contract.evaluateTransaction('queryAllBallots');
            await gateway.disconnect();
            return JSON.parse(respuesta.toString());
        } catch (e) {
            return null;
        }
    }
}

module.exports = HLConsumer;
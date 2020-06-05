'use strict';
const { Contract } = require('fabric-contract-api');
const { DNIStruct, BallotStruct, ResultStruct } = require('./Structs');

class EVoting extends Contract {

    async initLedger(ctx) {
        //Indicamos las opciones
        const choices = ["PSOE", "PP", "VOX", "UP", "Cs", "ERC", "JxCAT", "PNV", "EHB", "MP", "CUP", "CCa", "Na+", "BNG", "PRC", "TE"];
        //Indicamos la cinrcunscripcion permitida
        const districts = {
            "AND": "Andalucia",
            "ARA": "Aragon",
            "AST": "Asturias",
            "BAL": "Baleares",
            "CANA": "Canarias",
            "CANT": "Cantabria",
            "CYL": "Castilla y leon",
            "CLM": "Castilla la mancha",
            "CAT": "Catalunya",
            "CVA": "Comunidad valenciana",
            "EXT": "Extremadura",
            "GAL": "Galicia",
            "MAD": "Madrid",
            "MUR": "Murcia",
            "NAV": "Navarra",
            "PVA": "Pais vasco",
            "RIO": "Rioja",
            "CEU": "Ceuta",
            "MEL": "Melilla"
        }
        //Inicializamos el campo "Choices" mediante el JSON de las opciones
        await ctx.stub.putState('Choices', JSON.stringify(choices));
        //Inicializamos el campo "Districts" mediante el JSON de las opciones
        await ctx.stub.putState('Districts', JSON.stringify(districts));
        //Inicializamos el contador de botos
        await ctx.stub.putState('BallotInsert', "0");

    } 

    async queryVoter(ctx, _id) {
        //Comprobamos si ha votado ese ID (el ID esta en el ledger)
        const ledgerID = await ctx.stub.getState(_id);
        if (!ledgerID || ledgerID.length === 0) {
            //Si no esta enviamos un resultado negativo
            return { result: false, data: 'Votante no encontrado' }
        }
        var dni = DNIStruct.from(ledgerID.toString());

        //Si esta enviamos resultado resultado positivo y el timestamp del voto
        return { result: true, data: dni };
    }

    async addVote(ctx, _id, _choice, _district) {
        //Comprobamos primero si ha votado ese ID (el ID esta en el ledger)
        const ledgerID = await ctx.stub.getState(_id);
        if (!ledgerID || ledgerID.length === 0) {
            //Si no ha votado, comprobamos si la eleccion del usuario esta permitida (tanto la eleccion como el distrito)
            var allowedChoices = await ctx.stub.getState('Choices');
            allowedChoices = allowedChoices.toString();

            if (allowedChoices.includes(_choice)) {
                var allowedDistricts = await ctx.stub.getState('Districts');
                allowedDistricts = allowedDistricts.toString();

                if (Object.values(JSON.parse(allowedDistricts)).includes(_district)) {

                    //obtenemos el numero de votos
                    var ballotInsert = await ctx.stub.getState('BallotInsert');
                    ballotInsert = ballotInsert.toString();
                    //obtenemos la fecha de la transaccion
                    const timestamp = await ctx.stub.getTxTimestamp();
                    
                    //creamos el dni con el id del voto y fecha
                    const dni = new DNIStruct(timestamp.seconds.toString())
                    //Guardamos entonces ID y timestamp en el ledger
                    await ctx.stub.putState(_id, dni.toBuffer());

                    //creamos el voto con los datos del usuario
                    var ballot = new BallotStruct(_choice, _district, timestamp.seconds.toString());
                    //asignamos el voto al ledger
                    await ctx.stub.putState('Ballot_' + ballotInsert, ballot.toBuffer());
                    //incrementamos el valor del contador de votos
                    const newBallotInsert = parseInt(ballotInsert) + 1
                    await ctx.stub.putState('BallotInsert', newBallotInsert.toString());
                    return { result: true, data: { ballot: 'Ballot_' + ballotInsert, timestamp: timestamp.seconds.toString()}};

                } else {
                    return { result: false, data: 'El usuario no esta autorizado' };
                }
            } else {
                return { result: false, data: 'La eleccion no esta permitida' };
            }
        }
        return { result: false, data: 'El usuario ya ha votado' };
    }

    async queryAllBallots(ctx) {
        //Declaramos la variable de estructura de votos
        var resultStruct = new ResultStruct();
        //Obtenemos del ledger las opciones y los distritos permitidos
        var allowedDistricts = await ctx.stub.getState('Districts');
        var allowedChoices = await ctx.stub.getState('Choices');
        //Los convertimos a JSON para poder trabajar con ellos
        allowedDistricts = JSON.parse(allowedDistricts.toString());
        allowedChoices = JSON.parse(allowedChoices.toString());
        //Generamos la estructura de distrito => opciones
        Object.keys(allowedDistricts).forEach(short => {
            var region = allowedDistricts[short];
            resultStruct.createRegion(region, short);
            allowedChoices.forEach(party => {
                resultStruct.addPartyToRegion(region, party);
            });
        });

        //Obtenemos del ledger el numero de votaciones y lo pasamos a entero
        const ballotInsert = await ctx.stub.getState('BallotInsert');
        const intBallotInsert = parseInt(ballotInsert.toString());
        //Recorremos el ledger desde el valor 1 hasta el BallotInsert
        for (var i = 0; i < intBallotInsert; i++) {
            const ledgerBallotBuffer = await ctx.stub.getState("Ballot_" + i);
            if (ledgerBallotBuffer.toString()) {
                var iBallot = BallotStruct.from(ledgerBallotBuffer.toString());
                //Si el voto cumple los requisitos de distritos y opciones lo contabilizamos
                if (Object.values(allowedDistricts).includes(iBallot.district)) {
                    if (allowedChoices.includes(iBallot.choice)) {
                        resultStruct.increaseCounter(iBallot.district, iBallot.choice);
                    }
                }
            }
        }

        //devolvemos resultado positivo y la estructura de votos
        return { result: true, data: resultStruct.toString() };
    }

    async queryAllBallotsFromDistrict(ctx, _district) {
        var lista = [];

        var allowedDistricts = await ctx.stub.getState('Districts');
        allowedDistricts = allowedDistricts.toString();

        if (Object.values(JSON.parse(allowedDistricts)).includes(_district)) {
            const ballotInsert = await ctx.stub.getState('BallotInsert');
            const intBallotInsert = parseInt(ballotInsert.toString());
            for (var i = 0; i < intBallotInsert; i++) {
                const ledgerBallotBuffer = await ctx.stub.getState("Ballot_" + i);
                if (ledgerBallotBuffer.toString()) {
                    var iBallot = BallotStruct.from(ledgerBallotBuffer.toString());
                    if(iBallot.district==_district){
                        lista.push({ id: "Ballot_" + i, choice: iBallot.choice, timestamp: iBallot.timestamp });
                    }
                }
            }
        }
        return { result: true, data: lista };
    }

}

module.exports = EVoting;
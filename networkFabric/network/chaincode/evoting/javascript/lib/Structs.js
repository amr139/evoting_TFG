'use strict';

class DNIStruct {
    constructor(_timestamp) {
        this.timestamp = _timestamp;
    }

    static from(jsonData) {
        try {
            const jsonObject = JSON.parse(jsonData);
            return new DNIStruct(jsonObject.timestamp);
        } catch (e) {
            return;
        }
    }

    toBuffer() {
        return JSON.stringify({"timestamp": this.timestamp });
    }
}

class BallotStruct {

    constructor(_choice, _district, _timestamp) {
        this.choice = _choice;
        this.district = _district;
        this.timestamp = _timestamp;
    }

    static from(jsonData) {
        try {
            const jsonObject = JSON.parse(jsonData);
            return new BallotStruct(jsonObject.choice, jsonObject.district, jsonObject.timestamp);
        } catch (e) {
            return;
        }
    }

    toBuffer() {
        return JSON.stringify({ "choice": this.choice, "district": this.district, "timestamp": this.timestamp });
    }

}

class ResultStruct {

    constructor() {
        this.data = []
    }

    createRegion(_name, _shortName) {
        this.data[this.data.length] = { "region": _name, "nombreCorto": _shortName, "opciones": [] };
    }

    _getRegionIndex(_region) {
        return this.data.findIndex(function (a) { return a.region == _region; });
    }

    _getPartyIndexOnRegionIndex(_regionIndex, _party) {

        return this.data[_regionIndex].opciones.findIndex(function (a) { return a.nombre == _party; });
    }

    addPartyToRegion(_region, _party) {
        const index = this._getRegionIndex(_region);
        if (index >= 0) {
            this.data[index].opciones[this.data[index].opciones.length] = { "nombre": _party, "contador": 0 }
        }
    }

    increaseCounter(_region, _party) {
        const indexRegion = this._getRegionIndex(_region);
        const indexParty = this._getPartyIndexOnRegionIndex(indexRegion, _party);
        if (indexRegion >= 0 && indexParty >= 0) {
            this.data[indexRegion].opciones[indexParty].contador++;
        }
    }

    toString() {
        return this.data;
    }

}

module.exports = { DNIStruct, BallotStruct, ResultStruct };

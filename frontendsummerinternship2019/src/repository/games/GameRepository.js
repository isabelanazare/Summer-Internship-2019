import LocalStorageRepository from "../../framework/repository/LocalStorageRepository";
import postData from "../../utilities/postData";

export class GamesRepository {
    constructor() {
        this._localStorage = new LocalStorageRepository('game');
    }

    get isDataLoading() {
        return this._isDataLoading;
    }

    get gameData() {
        return this._localStorage.getData();
    }

    hasGameSession() {
        let data = this._localStorage.getData();

        return data.hasOwnProperty('sessionId');
    }

    async fetchGameData(gameId) {
        
        if (this._localStorage.isEmpty()) {
                    
            let response = await postData('http://localhost:3000/getGameData', {id: gameId});

            if (response.status === 'OK') {
                this._localStorage.saveData(response.message);
            }
            else if (response.status === 'ERROR') {
                throw new Error(response.message);
            }
        }  
    }

    async fetchGameSession(gameName, needsUpdate = false) {
        if (!this.hasGameSession() || needsUpdate === true) {
            let data = this._localStorage.getData();
            
            let response = await postData(`http://localhost:3000/getSession/${gameName}`, {gameId: data.id});

            console.log(response);

            data.sessionId = response.sessionId;
            data.sessionData = response.sessionData;
            this._localStorage.saveData(data);

            return response.sessionData;
        }
    }
}

export default function withGameRepo() {
    return function decorator(Class) {
        return (...args) => {
            if (args.length === 1 && typeof args[0] === 'undefined') {
                return new Class(new GamesRepository());
            }
            else {
                return new Class(...args, new GamesRepository());
            }
            
        };
    }
}
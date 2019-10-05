
export default class LocalStorageRepository {
    constructor(key) {
        if (typeof(key) !== 'string') {
            throw new Error('The key must be a string.');
        }
    
        this._key = key;
    }

    get key() {
        return this._key;
    }

    isStorageSupported() {
        if (typeof(Storage) === 'undefined')  {
            throw new Error('Local storage is not supported!');
        }

        return true;
    }

    getData() {
        let stringData = localStorage.getItem(this._key);

        return JSON.parse(stringData);
    }

    isEmpty() {
        let data = localStorage.getItem(this._key);

        if (!data) {
            return true;
        }

        return false;
    }

    saveData(newData) {
        let json = "";

        try {
            json = JSON.stringify(newData);
        }
        catch(e) {
            console.log("e");

            throw new Error('The given data is not json serializable.');
        }

        localStorage.setItem(this._key, json);
    }

    //removes the data from the local storage and returns it
    //In: none
    //Out: the data
    removeData() {
        let data = this.getData();

        localStorage.removeItem(this._key);

        return data;
    }
}
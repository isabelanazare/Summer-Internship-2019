import LocalStorageRepository from '../src/framework/repository/LocalStorageRepository';

var assert = require('assert');

describe('LocalStorageRepository', function() {
    var repo = null,
        testKey = 'test';

    beforeEach(function() {
        repo = new LocalStorageRepository(testKey);
        
    });

    afterEach(function() {
        localStorage.removeItem(testKey);
    });

    it('should not allow creating a repository with a key that is something else than string', function() {
        
        try {
            repo = new LocalStorageRepository(123);
        }
        catch(e) {
            return;
        }

        assert.fail("The local storage repository didn't throw an error.");
    });

    it('should save the given object as json into the local storage', function() {
        var testObj = {
            testing: 'localStorageRepo'
        };

        repo.saveData(testObj);

        assert.strictEqual(repo.getData().hasOwnProperty('testing'), true);
        assert.strictEqual(repo.getData().testing, testObj.testing);
    });

    it('should remove the property from the local storage and return its value', function() {
        var testObj = {
            testing: 'localStorageRepo'
        };

        repo.saveData(testObj);
        let returnedData = repo.removeData();

        assert.strictEqual(returnedData.testing, testObj.testing);
        assert.strictEqual(repo.isEmpty(), true);
    });

    it('should update the object stored in the local storage', function() {
        repo.saveData({});

        var storedObj = repo.getData();
        storedObj.testing = 'localStorageRepo';

        repo.saveData(storedObj);

        assert.strictEqual(repo.getData().testing, storedObj.testing);
    });
    
});
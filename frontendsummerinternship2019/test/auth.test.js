import { Auth } from "../src/framework/repository/user/Auth";

var assert = require('assert');

class UserValidator {
    static isUsernameValid(username) {
        if (typeof username !== 'string') {
            throw new Error('The username is not a string.');
        }

        if (username.length < 8 || username.length > 16) {
            throw new Error('The username should have between 8 and 16 characters.');
        }
        
        return true;
    }
}

describe('Auth', function() {
    var auth;

    beforeEach(function() {
        auth = new Auth(UserValidator);
    });

    it('should throw an error if the given username is not a string on login', function() {
        var username = 12345;

        try {
            auth.logIn(username);
        }
        catch(e){
            return;
        }
            
        assert.fail('Didn\'t throw an error.');
    });

    it('should throw an error if the username has less than 8 characters on login', function() {
        var username = 'abc';

        try {
            auth.logIn(username);
        }
        catch(e){
            return;
        }
            
        assert.fail('Didn\'t throw an error.');
    });

    it('should throw an error if the username has more than 16 characters on login', function() {
        var username = '123456789abcdefgh';

        try {
            auth.logIn(username);
        }
        catch(e){
            return;
        }
            
        assert.fail('Didn\'t throw an error.');
    });

    it('should save a userData object into the local storage after a successful log in', function() {
        var username = 'Test123546';

        try {
            auth.logIn(username);
        }
        catch(e) {
            assert.fail(e);
        }

        assert.strictEqual(auth.isLoggedIn(), true);
        assert.strictEqual(auth.userData.username, username);
    });

    it("should remove the user's data from the local storage on log out", function() {
        var username = 'Test123546';

        try {
            auth.logIn(username);
        }
        catch(e) {
            assert.fail(e);
        }

        let userData = auth.logOut();
        assert.strictEqual(auth.isLoggedIn(), false);
        assert.strictEqual(userData.username, username);
    });
});
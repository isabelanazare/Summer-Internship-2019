export default class UserValidator {
    static isUsernameValid(username) {
        if (typeof username !== 'string') {
            throw new Error('The username is not a string.');
        }

        if (username.length < 3 || username.length > 16) {
            throw new Error('The username should have between 3 and 16 characters.');
        }
        
        return true;
    }
}
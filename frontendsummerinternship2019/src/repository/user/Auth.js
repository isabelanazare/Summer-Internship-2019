import LocalStorageRepository from "../../framework/repository/LocalStorageRepository";
import postData from '../../utilities/postData';
import "@babel/polyfill";

export class Auth {
    constructor(userValidator) {
        this._validator = userValidator;
        this._localStorage = new LocalStorageRepository('user');
    }

    get userData() {
        return this._localStorage.getData();
    }

    isLoggedIn() {
        return !this._localStorage.isEmpty();
    }

    async logIn(username) {
        if (this._validator.isUsernameValid(username) === true) {

            let result = await postData(`${API_HOSTNAME}/authenticateUser`, { username });

            if (result.status === 'OK') {
                this._localStorage.saveData(result.message);
            }
            else {
                console.log(result);
            }   
        }
    }

    logOut() {
        return this._localStorage.removeData();
    }

    trackAuthSession(callback) {
        setInterval(() => {
            callback(this.isLoggedIn());
        }, 2000);
    }

}

export default function withAuth(userValidator) {
    return function decorator(Class) {
        return (...args) => {
            if (args.length === 1 && typeof args[0] === 'undefined') {
                return new Class(new Auth(userValidator));
            }
            else {
                return new Class(...args, new Auth(userValidator));
            }
            
        };
    }
}

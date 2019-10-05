import Component from "../../Component";
import layout from './login_middleware.html';
import withAuth from "../../repository/user/Auth";
import UserValidator from "../validators/UserValidator";

@withAuth(UserValidator)
export default class LoginMiddleware extends Component {
    constructor(props, auth) {
        console.log(props, auth);
        
        super(layout, {
            auth: auth,
            socket: props.socket
        }, props.children);
    }

    registerHelpers() {
        super.registerHelpers();

        this._handlebars.registerHelper('isAuthorized', (childKey) => {
            return this.state.auth.isLoggedIn();
        });
    }
}
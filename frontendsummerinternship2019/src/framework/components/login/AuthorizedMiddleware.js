import withAuth from "../../repository/user/Auth";
import UserValidator from "../validators/UserValidator";
import Component from "../../Component";
import layout from './authorized_middleware.html';

@withAuth(UserValidator)
export default class AuthorizedMiddleware extends Component {
    constructor(props, auth) {
        
        super(layout, {
            auth: auth,
            props: props
        }, props.children);
    }

    registerHelpers() {
        super.registerHelpers();

        this._handlebars.registerHelper('isAuthorized', (childKey) => {
            return this.state.auth.isLoggedIn();
        });

        this._handlebars.registerHelper('getPreviousRoute', () => {
            if (this.state.props.previousUrl) {
                return this.state.props.previousUrl; 
            }
            else {
                return "/page1";
            }
        });
    }

}
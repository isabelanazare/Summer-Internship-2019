import layout from './login_page_middleware.html';
import withAuth from '../../repository/user/Auth';
import UserValidator from '../../framework/components/validators/UserValidator';
import Component from '../../framework/Component';

@withAuth(UserValidator)
export default class LoginPageMiddleware extends Component {
    constructor(props, auth) {
        super(layout, 
            {
                auth: auth,
                props: props
            },
            props.children
        );
    }

    registerHelpers() {
        super.registerHelpers();

        this._handlebars.registerHelper('isAuthorized', () => {
            return this.state.auth.isLoggedIn();
        });

        this._handlebars.registerHelper('getPreviousRoute', () => {
            if (this.state.props.previousUrl) {
                return this.state.props.previousUrl; 
            }
            else {
                return "/dashboard";
            }
        });
    }
}
import layout from './login_middleware.html';
import withAuth from "../../repository/user/Auth";
import UserValidator from "../../framework/components/validators/UserValidator";
import Component from '../../framework/Component';

@withAuth(UserValidator)
export default class LoginMiddleware extends Component {
    constructor(props, auth) {
        //console.log(props, auth);
        
        super(layout, 
            {
                auth: auth,
                props: props
            },
            props.children,
            props
        );
    }

    componentWillMount(props) {
        this.props = props;
    }

    registerHelpers() {
        super.registerHelpers();

        this._handlebars.registerHelper('isAuthorized', () => {
            return this.state.auth.isLoggedIn();
        });
        
        this._handlebars.registerHelper('getProps', () => {
            return this.props;
        });
    }
}
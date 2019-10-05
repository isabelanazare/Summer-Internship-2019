import layout from './login_page.html';
import './login_page.css';
import Alert from '../alert/Alert';
import withAuth from '../../repository/user/Auth';
import UserValidator from '../../framework/components/validators/UserValidator';
import Component from '../../framework/Component';

@withAuth(UserValidator)
export default class LoginPage extends Component {
    constructor(auth) {
        super(
            layout,
            {
                isLoading: false
            },
            {
                Alert: Alert
            },
            {
                auth: auth
            }
        );
    }

    async handleFormSubmit(event) {
        event.preventDefault();

        let username = this.getObservableByName('username').value;

        this.setState({
            isLoading: true
        });

        try {
            await this.props.auth.logIn(username);

            this.setState({
                isLoading: false
            });
            
            location.hash = '/dashboard';
        }
        catch(e) {
            this.setState({
                isLoading: false
            });

            this.getObservableByName('username').value = username;
            this._childrenComponentsRefs.Alert.open('danger', e.message);
        }
    }

}
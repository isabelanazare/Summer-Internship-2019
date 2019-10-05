import layout from './login.html';
import Component from '../../Component';
import withAuth from '../../../components/gameApp/repository/user/Auth';
import UserValidator from '../validators/UserValidator';
import Alert from '../alert_message/Alert';
import SocketWrapper from '../../repository/SocketWrapper';

@withAuth(UserValidator)
export default class LoginPage extends Component {
    constructor(auth) {
        console.log(auth);

        super(
            layout,
            {}, 
            {
                Alert1: Alert
            }
        );
        
        this.auth = auth;
    }

    logIn(event) {
        event.preventDefault();
        let username = this.getObservableByName('username').value;

        try {
            this.auth.logIn(username);

            location.hash = '/page1';
        }
        catch(e) {
            this._childrenComponentsRefs.Alert1.open(e.message);
        }
            

            // if(history.pushState) {
            //     history.pushState(null, null, '/#/page1');
            // }
            // else {
            //     location.hash = '/#/page1';
            // }

        
    }
}
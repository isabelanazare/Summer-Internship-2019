import Alert from '../alert_message/Alert';
import * as layout from './test_template.html';
import './test.css';
import Component from '../../Component';
import SocketWrapper from '../../repository/SocketWrapper';
import withAuth from '../../../components/gameApp/repository/user/Auth';
import UserValidator from '../validators/UserValidator';

@withAuth(UserValidator)
export default class TestComponent extends Component {
    constructor(auth) {

        super(
            layout,
            {
                auth: auth,
                names: [],

            },
            {
                Alert1: Alert
            }
        );
    }
    
    logOut(event) {
        this.state.auth.logOut();
        location.hash = "/";
    }
    
    componentWillMount(){ 
        
        this.animations = {
            SlideRight : {
                className: 'SlideRight',
                condition: this.shouldSlideRight,
            }
        }

        this.registerAnimations();
    }

    componentDidMount() {
        SocketWrapper.registerListener('nameChange', (names) => {
            console.log(names);

            this.setState({names});
        });
    }

    shouldSlideRight(){
        return this.state.names[this.state.names.length - 1] === 'Teo';
    }

    nameKeyupHandler(event) {

        this.getObservableByName('nameCopy').value = event.target.value;
    }

    changeHandler(event) {
        console.log(event.target.value);
    }

    nameExists(name) {
        return this.state.names.indexOf(name) > -1;
    }

    addName() {
        let currentName = this.getObservableByName('currentName').value;

        if (currentName.length > 0) {
            if (this.nameExists(currentName) === false) {
                
                SocketWrapper.emitEvent('addName', currentName);
            }
            else {
                this._childrenComponentsRefs.Alert1.open('The name already exists');
            }
            
        }
        else {
            this._childrenComponentsRefs.Alert1.open('You need to specify a name.');
        }
    }

    deleteName(event, params) {
        console.log(params);
        let name = event.target.getAttribute('@observable');
        
        let names = this.state.names;

        const index = names.indexOf(name);

        if (index > -1) {
            SocketWrapper.emitEvent('deleteName', index);
        }
        
    }
}

import Component from '../../framework/Component';
import * as layout from './alert.html';
import './alert.css';

export default class Alert extends Component {
    constructor() {

        super(
            layout,
            {
                isOpen: false,
                alertType: 'alert-danger',
                message: 'This is an error message.'
            }
        );
    }

    componentWillMount() {
        this.animations = {
            Open : {
                className: 'Open',
                condition: this.shouldOpen,
            }
        };

        this.registerAnimations();
    }

    componentDidMount() {
        this.component.style.height = "0";
    }

    registerHelpers() {
        super.registerHelpers();

        this._handlebars.registerHelper('alertClasses', function(alertType) {
            return "alert alert-dismissible " +  alertType;
        });
    }

    shouldOpen() {
        return this.state.isOpen === true;
    }

    open(alertType, message) {
        this.setState({
            alertType: `alert-${alertType}`,
            message: message,
            isOpen: true
        });
    }
    
    close() {
        this.setState({
            isOpen:false
        });
    } 
}
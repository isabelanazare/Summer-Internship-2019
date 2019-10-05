import Component from '../../Component';

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

        //this.registerHelpers();
    }

    registerHelpers() {
        super.registerHelpers();

        this._handlebars.registerHelper('alertClasses', function(alertType) {
            return "alert alert-dismissible " +  alertType;
        });
    }

    open(alertType, message) {
        this.setState({
            alertType: `alert-${alertType}`,
            message: message
        });
    }
    
    close() {
        this.setState({
            isOpen:false
        });
    } 
}
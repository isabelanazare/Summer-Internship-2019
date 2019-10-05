import Component from "../../framework/Component";
import layout from "./snackbar.html";
import "./snackbar.css";

export default class Snackbar extends Component {
    constructor(props) {
        
        super(layout, {
                isOpen: false,
                text: ""
            },
            {},
            props
        );
    }

    componentWillMount() {
        this.animations = {
            Open : {
                className: 'open',
                condition: this.isSnackbarOpen,
            }
        };

        this.timeout = null;

        this.registerAnimations();
    }

    isSnackbarOpen() {
        return this.state.isOpen;
    }

    open(text) {
        clearTimeout(this.timeout);
        
        this.setState({
            isOpen: true,
            text: text
        });

        this.timeout = setTimeout(() => {
            this.setState({
                isOpen: false
            });
        }, 3000);
    }

    close() {
        this.setState({
            isOpen: false
        });
    }
}
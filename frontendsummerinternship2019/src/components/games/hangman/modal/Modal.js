import Component from "../../../../framework/Component";
import "./modal.css";
import layout from './modal.html';

export default class Modal extends Component {
    constructor(props) {
        console.log(props);
        super(
            layout,
            {
                isOpen: true
            },
            {
                ModalComponent : props.component 
            },
            props
        );
    }

    componentWillMount() {
        this.animations = {
            openModal: {
                className: 'open',
                condition: this.isModalOpen
            },
            displayOverlay: {
                className: 'visible',
                condition: this.isModalOpen
            }
        };

        this.registerAnimations();
    }

    isModalOpen() {
        return this.state.isOpen;
    }
}
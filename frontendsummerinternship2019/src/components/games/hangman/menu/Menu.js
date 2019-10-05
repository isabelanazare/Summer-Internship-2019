import Component from "../../../../framework/Component";
import layout from './menu.html';
import "./menu.css";

export default class Menu extends Component {
    constructor(props) {
        super(layout, {}, {}, props);
    }

    componentWillMount() {
        this.disconnectClickHandler = this.props.disconnectClickHandler;
        this.getInviteLinkClickHandler = this.props.getInviteLinkClickHandler;
    } 
}
import Component from "../../../../framework/Component";
import "./hangmanModal.css";
import layout from './hangmanModal.html';

export default class HangmanModal extends Component {
    constructor(props) {

        props.leaderBoard.sort((a,b) => (a.score > b.score) ? -1 : 1);
        super(
            layout,
            {},
            {},
            props
        );
       
    }

    registerHelpers() {
        super.registerHelpers();

        this._handlebars.registerHelper('computeLeaderboardPlace', (value) => {
            return parseInt(value) + 1;
        });
    }

}
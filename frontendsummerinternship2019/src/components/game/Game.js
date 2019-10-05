import layout from './game.html';
import Component from '../../framework/Component';
import Hangman from '../games/hangman/Hangman';
import "@babel/polyfill";

export default class Game extends Component {
    constructor(props) {

        super(layout, 
            {
            }, 
            {
               Hangman: Hangman
            },
            props
        );
    }
    
    componentWillMount() {
    }

}
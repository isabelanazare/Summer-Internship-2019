import Component from "../../../../framework/Component";
import layout from './hangman_character.html';
import characterOnlyLayout from './character_only.html';
import characterAndBaseLayout from './character_and_base.html';
import characterAndPillar from './character_and_pillar.html';
import characterAndHanger from './character_and_hanger.html';
import deadCharacter from './dead_character.html';
import "./hangman_character.css";

export default class HangmanCharacter extends Component {
    constructor(props) {
        super(layout, {
            characterLayoutsAndLives: []
        }, {}, props);
    }

    registerHelpers() {
        super.registerHelpers();
        this._handlebars.registerHelper('renderCharacterState', () => {
            return this.state.characterLayoutsAndLives[this.props.lives];
        });
    }

    componentWillMount() {
        this.state.characterLayoutsAndLives[4] = characterOnlyLayout;
        this.state.characterLayoutsAndLives[3] = characterAndBaseLayout;
        this.state.characterLayoutsAndLives[2] = characterAndPillar;
        this.state.characterLayoutsAndLives[1] = characterAndHanger;
        this.state.characterLayoutsAndLives[0] = deadCharacter;
    }

    componentDidMount() {
        this.skipCharacterAnimations();
    }

    hasFewerLives(nextNoLives) {
        return this.props.lives > nextNoLives;
    }

    getHangerPartsArray() {
        let hangerParts = [];
        hangerParts.push(this.component.querySelector('#base'));
        hangerParts.push(this.component.querySelector('#pillar'));
        hangerParts.push(this.component.querySelector('#hanger-bar'));
        hangerParts.push(this.component.querySelector('#hanger-end'));

        return hangerParts;
    }

    disableAnimation(elem) {
        if (elem) {
            elem.style.animationDuration = '0s';
            elem.style.animationDelay = '0s';
        }
    }

    skipCharacterAnimations() {;
        let bodyElements = this.getObservableByName('hangman-container').querySelectorAll('.hangman-body'),
            hangerParts = this.getHangerPartsArray();

        
        bodyElements.forEach(this.disableAnimation);
        hangerParts.forEach(this.disableAnimation);
    }

    setProps(nextProps) {
        if (this.hasFewerLives(nextProps.lives) === true) {
            super.setProps(nextProps);
        }
        else {
            this.skipCharacterAnimations();
        }
    }
}
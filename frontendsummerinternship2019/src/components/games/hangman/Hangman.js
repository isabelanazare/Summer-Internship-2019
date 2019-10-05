import Component from "../../../framework/Component";
import layout from './hangman.html';
import livesLayout from './lives_layout.html';
import "./hangman.css";

import PlayersList from "./playersList.js/PlayersList";
import Modal from "./modal/Modal";
import HangmanModal from "./hangmanModal/HangmanModal";

import SocketWrapper from "../../../framework/repository/SocketWrapper";
import UserValidator from "../../../framework/components/validators/UserValidator";
import withAuth from "../../../repository/user/Auth";
import postData from "../../../utilities/postData";
import "@babel/polyfill";
import HangmanCharacter from "./hangmanCharacter/HangmanCharacter";
import Menu from "./menu/Menu";
import Snackbar from "../../snackbar/Snackbar";


@withAuth(UserValidator)
export default class Hangman extends Component {
    constructor(props, auth) {

        super(layout,
            {
                sessionId: "",
                sessionData: null,
                virtualKeyboard: [
                    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
                    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
                    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
                ],
                userRepository: auth
            },
            {
                Menu: Menu,
                Snackbar: Snackbar,
                PlayersList: PlayersList,
                Modal: Modal,
                HangmanModal: HangmanModal,
                HangmanCharacter: HangmanCharacter
            },
            props
        );
    }

    componentWillMount() {
        this.state.modalProps = {
            component: this._childrenComponents['HangmanModal'],
            gameEnded: false,
            leaderBoard: [],
            phrase: ''
        }

        this.keyupHandler = this.keyupHandler.bind(this)
        window.addEventListener('keyup', this.keyupHandler);
        this.livesLayout = this._handlebars.compile(livesLayout);

        this.disconnectClickHandler = this.disconnectClickHandler.bind(this);
        this.getInviteLinkClickHandler = this.getInviteLinkClickHandler.bind(this);
    }

    componentWillUnmount() {
        window.removeEventListener('keyup', this.keyupHandler);
    }

    getDataOfUser(userId) {
        return this.state.sessionData.users[userId];
    }

    getLivesStylingOfUser(userId) {

        let lives = [],
            noRemainingLives = this.getDataOfUser(userId).lives,
            noUsedLives = this.state.sessionData.initialNumberOfLives - noRemainingLives;

        for (let i = 1; i <= noRemainingLives; i++) {
            lives.push({
                className: 'filled-heart',
                iconName: 'favorite'
            });
        }

        for (let i = 1; i <= noUsedLives; i++) {
            lives.push({
                className: 'empty-heart',
                iconName: 'favorite_border'
            });
        }

        return lives;
    }

    registerHelpers() {
        super.registerHelpers();

        this._handlebars.registerHelper('keyboardButtonClasses', (key) => {
            let classes = "";

            if (this.state.sessionData.pressedLetters[key] === true) {
                classes += 'inactive';
            }

            if (this.state.sessionData.guessedLetters.indexOf(key) > -1) {
                classes += ' gueesedLetter';
            }

            return classes;
        });

        this._handlebars.registerHelper('hiddenIfSpace', (letter) => {
            if (letter === ' ') {
                return 'space-character';
            }
            
        });

        this._handlebars.registerHelper('playersListProps', () => {
            let currentUserId = this.state.userRepository.userData.id;
            let sessionUsers = JSON.parse(JSON.stringify(this.state.sessionData.users));
            delete sessionUsers[currentUserId];

            return {
                getLivesStylingOfUser: this.getLivesStylingOfUser.bind(this),
                initialNoLives: this.state.sessionData.initialNumberOfLives,
                users: Object.entries(sessionUsers)
            };
        });

        this._handlebars.registerHelper('hangmanCharacterProps', () => {
            const userId = this.state.userRepository.userData.id;

            return {
               lives: this.state.sessionData.users[userId].lives 
            }
        });

        this._handlebars.registerHelper('menuProps', () => {
            return {
                disconnectClickHandler: this.disconnectClickHandler,
                getInviteLinkClickHandler: this.getInviteLinkClickHandler
            };
        });
        
    }

    async componentDidMount() {

        this.state.userRepository.trackAuthSession(this.redirectIfNotLoggedIn);

        if (!this.state.sessionData) { 
            let sessionKey;

            if (this.props.routeParams.length == 2) {
                sessionKey = this.props.routeParams[1];

                let response = await postData(`${API_HOSTNAME}/session/hangman/prepareClientToConnectToGivenSession`,
                    {sessionKey, userKey: this.state.userRepository.userData.id});
            }
            else {
                let response = await postData(`${API_HOSTNAME}/session/hangman/getNewSession`,
                    {gameId: this.props.id, userId: this.state.userRepository.userData.id}
                );

                sessionKey = response.sessionId;

            }
            
            this.setState({
                sessionId: sessionKey,
            });

            SocketWrapper.joinSession(this.state.userRepository.userData.id, sessionKey, 'hangman');
            
        }

        SocketWrapper.registerListener('sessionUpdated', session => {

            if(session.data.gameEnded){

                this.state.modalProps.leaderBoard = this.getLeaderboard(session);
                this.state.modalProps.phrase = this.getPhrase(session);
                SocketWrapper.emitEvent("disconnectFromSession");
            }

            this.setState({
                sessionData: session.data,
            });    
        });

        SocketWrapper.registerListener('leftSession', () => {
            location.hash = "/dashboard";
        });

    }

    getPhrase(session) {
        return session.data.phrase;
    } 

    getLeaderboard(session) {
        let arr = [];
        let users = session.data.users;
        for(var key in users) {
            arr.push(users[key]);
        }

        return arr;
    }

    submitLetter(key) {
        let userId = this.state.userRepository.userData.id,
            userData = this.getDataOfUser(userId);

        if (this.isLetter(key)) {
            let message = '';

            if (this.state.sessionData.gameEnded) {
                message = 'Game has already ended, you can no longer submit letters';
            }
            else if (userData.lives === 0) {
                message = 'You are dead so you cannot play anymore.'
            }

            if (message.length > 0)
                return this._childrenComponentsRefs.Snackbar.open(message);
                

            SocketWrapper.emitEvent('letterPressed',
                {
                    sessionId: this.state.sessionId,
                    userId: this.state.userRepository.userData.id,
                    letter: key
                }
            );
        }
    }

    keyClickHandler(event, params) {

        this.submitLetter(params.key);
    }

    keyupHandler(event) {
        this.submitLetter(event.key);
    }

    isLetter(str) {
        str = str.toLowerCase();
        return str.length === 1 && str.match(/[a-z]/i);
    }

    redirectIfNotLoggedIn(isLoggedIn) {

        if (isLoggedIn === false) {
            location.hash = "/";
        }
    }

    disconnectClickHandler(event) {
        SocketWrapper.emitEvent("leaveSession");
    }

    getInviteLinkClickHandler() {
        let link = location.href;

        if (this.props.routeParams.length === 1) {

            if (link[link.length - 1] === "/")
                link += this.state.sessionId;
            else {
                link += `/${this.state.sessionId}`;
            }
        }
        navigator.clipboard.writeText(link).then(() => {
            this._childrenComponentsRefs.Snackbar.open("Link saved to clipboard.");
        });
    }
}
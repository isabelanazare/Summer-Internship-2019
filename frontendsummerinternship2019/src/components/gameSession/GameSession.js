import Component from "../../framework/Component";
import * as layout from './gameSession.html';
import './gameSession.css';
import Chat from '../chat/Chat';
import Game from '../game/Game';
import postData from "../../utilities/postData";
import withGameRepo from "../../repository/games/GameRepository";

@withGameRepo()
export default class GameSession extends Component {
    constructor(props, gameRepo) {

        super(layout, 
            {
                isDataLoading: false,
                isChatOpen: false,
                gameData: null,
                gameRepo: gameRepo
            },
            {
                Chat,
                Game
            },
            props
        );
    }

    componentWillMount() {
        this.state.toggleChatOpen = this.toggleChatOpen.bind(this);

        this.animations = {
            toggleActiveChat: {
                className: 'active',
                condition: this.isChatActive
            },
            toggleGameWindow: {
                className: 'inactive',
                condition: this.isChatActive
            },
            toggleShowChat: {
                className: 'inactive',
                condition: this.isChatActive
            }
        }

        this.registerAnimations();
    }

    registerHelpers() {
        super.registerHelpers();
        
        this._handlebars.registerHelper('gameProps', () => {
            return {
                gameData: this.state.gameData,
                routeParams: this.props.routeParams
            };
        });
    }

    async componentDidMount() {
        if (!this.state.isDataLoading) {
            this.setState({isDataLoading: true});

            let gameId = this.props.routeParams[0];
            let response = await postData(`${API_HOSTNAME}/getGameData`, {id: gameId});
            
            if (response.status === 'OK') {
                this.setState({
                    gameData: response.message
                });
            }
            else if (response.status === 'ERROR') {
                //throw new Error(response.message);
            }

            this.setState({isDataLoading: false});
        }
    }

    isChatActive() {
        return this.state.isChatOpen;
    }

    toggleChatOpen(isOpen) {
        this.setState({
            isChatOpen: isOpen
        })
    }

    showChat() {
        this.toggleChatOpen(true);
    }


}
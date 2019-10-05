import layout from './players_list.html';
import Component from '../../../../framework/Component';
import "./players_list.css";
import withAuth from '../../../../repository/user/Auth';
import UserValidator from '../../../../framework/components/validators/UserValidator';
import playerLayout from './player_layout.html';

@withAuth(UserValidator)
export default class PlayersList extends Component {
    constructor(props, auth) {
        props.userRepository = auth;

        super(
            layout,
            {
                isOpen: false
            },
            {},
            props
        );
    }

    registerHelpers() {
        super.registerHelpers();

        this._handlebars.registerHelper('renderUser', (userData) => {
            let userId = userData[0];
            
            if (this.props.userRepository.userData.id === userId) {
                return '';
            }
            let playerData = {};
            playerData.lives = this.props.getLivesStylingOfUser(userId);
            playerData.username = userData[1].username;
            
            return this.playerLayout(playerData);
        });
    }

    componentWillMount() {
        this.playerLayout = this._handlebars.compile(playerLayout);

        this.animations = {
            togglePlayersList: {
                className: 'open',
                condition: this.isListOpen
            }
        }

        this.registerAnimations();
    }

    isListOpen() {
        return this.state.isOpen;
    }

    togglePlayersList() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
}
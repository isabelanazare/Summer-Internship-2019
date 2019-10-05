import Component from "../../framework/Component";
import layout from './dashboard.html';
import './dashboard.css';
import withAuth from "../../repository/user/Auth";
import UserValidator from "../../framework/components/validators/UserValidator";
import "@babel/polyfill";

@withAuth(UserValidator)
export default class Dashboard extends Component {
    constructor(props, auth) {
        props.auth = auth;

        super(
            layout,
            {
                isloadingGames: false,
                games: []
            },
            {},
            props
        );
    }

    registerHelpers() {
        super.registerHelpers();

        this._handlebars.registerHelper('imageUrl', (gameId) => {
            return `${API_HOSTNAME}/gamesThumbnails/${gameId}.jpg`;
        });
    }

    async componentDidMount() {
        let games = [];

        this.setState({isloadingGames: true});

        let response = await fetch(`${API_HOSTNAME}/getAllGames`)
            .then(response => response.json());
        
        if (response.status === 'OK') {
            games = response.message;
        }

        this.setState({
            games: games,
            isloadingGames: false
        });
    }

    logOut() {
        this.props.auth.logOut();
        location.hash = "/";
    }
}
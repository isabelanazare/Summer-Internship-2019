import Component from "../../framework/Component";
import * as layout from './messages.html';
import SocketWrapper from '../../framework/repository/SocketWrapper';
import withAuth from "../../repository/user/Auth";
import UserValidator from "../../framework/components/validators/UserValidator";

@withAuth(UserValidator)
export default class Messages extends Component {
    constructor(auth){ 
        super(layout, {
            messages: [],
            auth
        }, {});
    }

    render() {
        super.render();

        let messages = this.component.querySelector("#messages_wrapper");

        this.component.style.height = "100%";
        messages.scrollTop = messages.scrollHeight;
    }

    registerHelpers() {
        super.registerHelpers();

        this._handlebars.registerHelper('getMessageSender', sender => {
            if(sender === 'server')
                return 'server';
            if(sender === this.state.auth.userData.username)
                return 'me';
            else
                return 'not_me';
        });
    }

    componentDidMount() {
        SocketWrapper.registerListener("receivedMessage", ({message, sender}) => {
            this.addMessage(message, sender);
        });

        SocketWrapper.registerListener("getMessages", (messages) => {
            this.addMessages(messages);
        })

        SocketWrapper.registerListener("userGuessedLetter", ({sender, player, letter}) => {

            let message = `${player} guessed letter '${letter.toUpperCase()}'`;

            this.addMessage(message, sender);
        });
        
        SocketWrapper.registerListener("newUser", ({sender, username}) => {

            let message = "Welcome, "+ username;

            this.addMessage(message, sender);
        });
    }

    addMessage(message, sender) {
        this.setState({
            messages: this.state.messages.concat({message, sender})
        });
    }

    addMessages(messages) {
        this.setState({
            messages
        })
    }
}
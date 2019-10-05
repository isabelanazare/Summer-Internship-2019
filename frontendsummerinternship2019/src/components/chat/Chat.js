import './chat.css';
import * as layout from './chat.html';
import Component from '../../framework/Component';
import Messages from './Messages'
import SocketWrapper from '../../framework/repository/SocketWrapper';
import withAuth from '../../repository/user/Auth';
import UserValidator from '../../framework/components/validators/UserValidator';

@withAuth(UserValidator)
export default class Chat extends Component {
    constructor(props, auth){

        super(layout,
            {
                auth
            }, 
            {
                Messages: Messages
            });
        
        this.toggleChatOpen = props;
    }

    sendMessage() {
        let messageInput = document.getElementById("message");
        
        let message = messageInput.value;

        if(message.trim().length > 0){

            messageInput.value = "";

            SocketWrapper.emitEvent("newMessage", 
            {
                message, 
                sender: this.state.auth.userData.username

            });

            this._childrenComponentsRefs.Messages.addMessage(message, this.state.auth.userData.username);
        }
    }

    enterToSend(ev){
        ev.stopPropagation();
        if(ev.keyCode === 13){
            ev.preventDefault();
            this.sendMessage();
        }
    }

    hideChat() {
        this.toggleChatOpen(false);
    }

}
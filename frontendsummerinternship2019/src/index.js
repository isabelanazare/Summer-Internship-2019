import RouterComponent from './framework/router/RouterComponent';
import LoginMiddleware from './components/loginMiddleware/LoginMiddleware';
import LoginPage from './components/loginPage/LoginPage';
import Dashboard from './components/dashboard/Dashboard';
import LoginPageMiddleware from './components/loginPage/LoginPageMiddleware';
import GameSession from './components/gameSession/GameSession';

function main() {
    
    document.getElementById("app").appendChild(new RouterComponent({
        "/":{
            component: LoginPageMiddleware,
            parameters: {
                children: {
                    component: LoginPage
                }
            }
        },
        "/dashboard": {
            component: LoginMiddleware,
            parameters: {
                children: {
                    component: Dashboard
                }
            }
        },
        "/games": {
            component: LoginMiddleware,
            parameters: {
                children: {
                    component: GameSession
                }
            }
        }
    }).component);
}

window.onload = main;



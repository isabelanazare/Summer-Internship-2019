import Component from '../../Component';
import * as layout from './router_template.html';
//import Page1Comp 
export default class RouterComponent extends Component {
  
    constructor(routes) {
        var state = {         
         }
        super(state,
            layout,
            {
                currentLocation: '/'
            },
            routes
        );
    }
       
renderRoute (){

    //if 
}
    router () {

        var url = location.hash.slice(1) || '/';
        console.log(url);
    
        window.addEventListener('hashchange', this.printSomething); 
       // window.addEventListener('load', this.increment);
    }
    printSomething() {
        console.log("something");
        // set state ->>> current location
        
    }
}


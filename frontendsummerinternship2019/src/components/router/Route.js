import Component from '../../Component';
import * as layout from './router_template.html';

export default class Route extends Component {
    constructor(path, primaryComponent) {
        super(
            layout,
            {
                path: path
            },
            {
                primaryComponent: primaryComponent
            }
        )
    }
        //route("/page1",Page1Comp);
            // Listen on hash change:
    //window.addEventListener('hashchange', router2);
    // Listen on page load:
    //window.addEventListener('load', router2);
    
   
}
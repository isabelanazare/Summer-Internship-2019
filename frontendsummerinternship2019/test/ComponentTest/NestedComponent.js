import Component from '../../src/framework/Component';

var fs = require('fs');
var nestedLayout = fs.readFileSync(__dirname + '\\nested_component.html', 'utf-8');

export default class NestedComponent extends Component {

    constructor(state, childrenComponents) {
        super(
            nestedLayout,
            state, 
            childrenComponents
            );

    }

    increment_count() {
        this.setState({
            count: this._state.count + 1
        });
                
    }

}
import Component from '../../src/framework/Component';

var fs = require('fs');
var testLayout = fs.readFileSync(__dirname + '\\test_component.html', 'utf-8');

export default class TestComponent extends Component {
    constructor(state, childrenComponents) {
        
        super(
            testLayout, 
            state,
            childrenComponents
        );
    }

    increment(ev, param1, param2) {
        this.setState({
            count: this.state.count + param2
        });
    }

    decrement(ev, step) {
        this.setState({
            count: this.state.count - step
        });
    }

    increment2() {
        this.setState({
            count: this.state.count + 2
        });
    }
}
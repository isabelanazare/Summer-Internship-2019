var assert = require('assert');

const jsdom = require('jsdom');
const {JSDOM} = jsdom;

global.dom  = new JSDOM(`<!DOCTYPE html><div></div>`);
global.window = dom .window;
global.document = dom .window.document;
global.navigator = global.window.navigator;

import TestComponent from './TestComponent';
import NestedComponent from './NestedComponent';

describe('Component test', function(){

    var testComponent = null;

    this.beforeEach(function() {

        testComponent = new TestComponent(
            {
                count: 0
            },
            {
                Nested: NestedComponent
            }
        )
    })

    it('should update state when creating component', function(){

        assert.strictEqual(testComponent.state.count, 0);

    })

    it('should update state', function(){
        testComponent.setState({count:3});
        assert.strictEqual(testComponent.state.count, 3);
    })
  
    it("should check whether the component id is the same as the component's html el", function(){

        assert.strictEqual(testComponent._id, testComponent.component.id);

    });

    it('should have children components', function(){

        assert.notStrictEqual(testComponent.childrenComponents,undefined);
    })
  
    it("should check if UI was updated according to changes applied to the state", function(){

        testComponent.increment(null, 1, 2);
        assert.strictEqual(testComponent.component.querySelector("#count").innerHTML, '' + testComponent.state.count);
    })

    it("component should contain the same number of children after state was updated", function(){

        let oldChildNodesLength = testComponent.component.childNodes[0].childNodes.length;
        testComponent.render();

        assert.strictEqual(oldChildNodesLength, testComponent.component.childNodes[0].childNodes.length);
        assert.notStrictEqual(testComponent.component.querySelector('#count'), null);

    })

});





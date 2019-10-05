import Handlebars from 'handlebars';
import * as uuid from 'uuid';
import ParametersParser from './utilities/ParametersParser';

let paramsParser = new ParametersParser();

export default class Component {

    constructor(layout, state = {}, childrenComponents = {}, props = {}) {
        this._id = 'cmp-' + uuid.v4();

        this._handlebars = Handlebars.create();

        this._state = state;
        this.props = props;
        this._layout = layout;
        this._childrenComponents = childrenComponents;
        this._childrenComponentsRefs = {};
        this.component = this.createRootElement();
        this._template = this._handlebars.compile(layout);
        this._observables = {};

        this.componentWillMount(props);
        this.registerHelpers();
        this.render();
        this.componentDidMount();
    }

    componentWillMount() {
        
    }
    
    componentDidMount() {

    }

    componentWillUnmount()  {
        
    }

    get state() {
        return this._state;
    }

    get observables() {
        return this._observables;
    }

    get childrenComponents() {
        return this._childrenComponents;
    }

    getComponentByName(name) {
        if (this._childrenComponents.hasOwnProperty(name)) {
            return this._childrenComponents[name];
        }
    }

    getObservableByName(name) {
        if (this._observables.hasOwnProperty(name)) {
            return this._observables[name];
        }
    }

    createRootElement() {
        let elem = document.createElement('div');
        elem.id = this._id;
        elem.style.height = 'inherit';
        
        return elem;
    }

    hasNewProps(nextProps) {
        for(let key in nextProps) {
            if (nextProps[key] !== this.props[key]){
                return true;
            }
                
        }

        return false;
    }

    setProps(obj) {
        if (typeof obj === 'object') {;
            for(let key in obj) {
                this.props[key] = obj[key];
            }
        }

        this.component = this.createRootElement();
        this.render();
    }

    setState(obj) {
        if(typeof obj !== 'object') throw new Error("The provided data is not an object");

        for(var key in obj) {
            this._state[key] = obj[key];
        }

        this.render();
    }

    render() {
        
        this._observables = {};

        this.component.innerHTML = this._template({
            state: this._state,
            props: this.props,
            childrenComponents: this._childrenComponents
        });

        this.forEachChild(this.component, this.registerHandlers);
        this.updateChildrenComponents(this);
    }

    forEachChild(element, callback) {

        let childNodes = element.childNodes;

        callback = callback.bind(this);

        if(childNodes.length > 0) {
            for (let i = 0; i < childNodes.length; i++) {
                let childNode = childNodes[i];

                if(childNode.nodeType === 3)
                    continue;

                if(this.findChildById(childNode.id))
                    continue;
                
                if(childNode.childNodes.length > 1)
                    this.forEachChild(childNode, callback);
                
                callback(childNode);
            }
        }
    }

    bindHandlersOnNode(node) {

        const onClick = node.getAttribute("@click");
        const onKeyup = node.getAttribute("@keyup");
        const onSubmit = node.getAttribute("@submit");
        const onChange = node.getAttribute("@change");

        if(onClick){
            
            let clickHandler = this.getHandler(onClick);

            node.onclick = (event) => { 
                this[clickHandler.eventName](event, ...clickHandler.eventParams);
            }
        }

        if (onKeyup) {
            let keyupHandler = this.getHandler(onKeyup);

            node.onkeyup = (event) => {
                this[keyupHandler.eventName](event, ...keyupHandler.eventParams);
            };
        }

        if (onChange) {
            let changeHandler = this.getHandler(onChange);

            node.onchange = (event) => {
                this[changeHandler.eventName](event, ...changeHandler.eventParams);
            }
        }

        if (onSubmit) {
            node.onsubmit = (event) => {
                this[onSubmit](event);
            };
        }
    }

    getHandler(eventHandler) {
        let array = eventHandler.split('(');
        let eventName = array[0];
        let eventParams = array[1];
        
        if(!paramsParser.isJSON(eventParams))
            eventParams = eventParams.replace(')', '').replace(/ /g, '').split(',');

        if(eventParams.length == 1 && eventParams[0] === '')
            eventParams = null;

        if(paramsParser.isJSON(eventParams))
            eventParams = [paramsParser.parseJSON(eventParams)];
        else    
            eventParams = paramsParser.TryParseIntParams(eventParams);
        

        return {
            eventName,
            eventParams
        };
    }

    registerHelpers() {
        this.registerRenderComponentHelper();
        this.registerJSONHelper();
        this.registerRouterHelepers();
    }

    registerJSONHelper(){
        this._handlebars.registerHelper('json', (options) => {
            return JSON.stringify(options.hash).replace(/"/g, '&quot;');
        });
    }

    registerRouterHelepers() {

        this._handlebars.registerHelper('redirect', (path) => {
            location.hash = path;
        });
    }

    unmountChildren() {
        for (let key in this._childrenComponentsRefs) {
            this._childrenComponentsRefs[key].componentWillUnmount();
            this._childrenComponentsRefs[key].unmountChildren();
            delete this._childrenComponentsRefs[key];
        }
    }

    wasComponentMounted(componentKey) {
        return this._childrenComponentsRefs.hasOwnProperty(componentKey);
    }

    getOldStateAndChildrenRefs(componentKey) {
        let state = {},
            childrenRefs = {};

        if (this._childrenComponentsRefs.hasOwnProperty(componentKey)) {
            state = this._childrenComponentsRefs[componentKey]._state;
            childrenRefs = this._childrenComponentsRefs[componentKey]._childrenComponentsRefs;
        }

        return {state, childrenRefs};
    }

    createChildInstance(componentKey, params) {

        let comp;

        if (this.wasComponentMounted(componentKey) === true){
            comp = this._childrenComponentsRefs[componentKey];
            comp.setProps(params);
            
            return this._childrenComponentsRefs[componentKey];
        }
        else {
            comp = new this._childrenComponents[componentKey](params);
        }

        return comp;
    }

    registerRenderComponentHelper() {

        if (Object.keys(this._childrenComponents).length > 0) {

            this._handlebars.registerHelper("renderComponent", (componentKey, options) => {

                let params = options.hash.params;

                let newChild = this.createChildInstance(componentKey, params);

                this._childrenComponentsRefs[componentKey] = newChild;
                
                return newChild.component.outerHTML;
            });
        }
    }

    findChildById(id) {
        
        for(let key in this._childrenComponentsRefs) {
            if(this._childrenComponentsRefs[key]._id === id)
                return true;
        }

        return false;
    }

    updateChildrenComponents(parentComponent) {

        for(let key in parentComponent._childrenComponentsRefs) {

            let childComponent = parentComponent._childrenComponentsRefs[key];

            childComponent.component = parentComponent.component.querySelector('#' + childComponent._id);
            
            if (childComponent.component === null) {
                continue;
            }

            childComponent.forEachChild(childComponent.component, this.registerHandlers);
            this.updateChildrenComponents(childComponent);
        }
    }
    
    registerObservable(node) {
        let observableValue = node.getAttribute('@observable');

        if (observableValue) {
            this._observables[observableValue] = node;
        }
    }

    applyClassChanges(childNode) {

        let animationName = childNode.getAttribute("@animate");
        
        if(animationName){

            let className = this.animations[animationName].className;
            let shouldHaveClass = this.animations[animationName].condition.call(this);

            if(shouldHaveClass && !this.hadClass[className]){
                
                if(!childNode.classList.contains(className))
                    this.addClassWithTransition(childNode, className);
            
            } else if (shouldHaveClass && this.hadClass[className]){
                
                this.addClass(childNode, className);

            } else if (!shouldHaveClass && this.hadClass[className]) {
                
                this.addClass(childNode, className);
                this.removeClassWithTransition(childNode, className);

            }
        }
            
    }

    addClassWithTransition(childNode, className){
        setTimeout(() => {
            childNode.classList.add(className);
            this.hadClass[className] = true;
        }, 0);
    }

    addClass(childNode, className) {
        childNode.classList.add(className);
    }

    removeClassWithTransition(childNode, className) {
        setTimeout(() => {
            childNode.classList.remove(className);
            this.hadClass[className] = false;
        }, 0);
    }

    registerAnimations(){ 

        this.hadClass = {};

        for(var key in this.animations) {
            this.hadClass[this.animations[key].className] = false;
        }

    }

    registerHandlers(childNode) {
        this.bindHandlersOnNode(childNode);
        this.registerObservable(childNode);
        this.applyClassChanges(childNode);
    }

}
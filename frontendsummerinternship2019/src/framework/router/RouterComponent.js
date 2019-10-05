import * as layout from './router_template.html';
import NotFound from './NotFound';
import Component from '../Component';

export default class RouterComponent extends Component {
  
    constructor(routes) {
        
        let children = (function() {
            let children = {};
            Object.entries(routes).forEach((elem) => {
                children[elem[0]] = elem[1].component;
            });

            return children;
        }());
        
        super(
            layout,
            {
                previousUrl: null,
                activeRoute: "",
                routeParams: []
            },
            children,
            routes
        );
        
    }

    componentWillMount(props) {
        
        if(!this.isValidURL()){
            this.handleInvalidURL();
        }

        this._childrenComponents.notFound = NotFound;

        let urlData = this.getUrlData(location.hash.slice(1));
        this.state.activeRoute = urlData.url;
        this.state.previousUrl = urlData.previousUrl;
        this.state.routeParams = urlData.routeParams;

        this.routes = props;
    }

    handleInvalidURL() {
        let path = location.pathname;
        location.href = location.origin + '/#' + path;
    }

    getUrlData(completeUrl) {

        const urlSegments = completeUrl.split('/');
        urlSegments.splice(0, 1);

        let url = '/', routeParams = [];

        if (urlSegments[0].length > 0) {
            url = '/' + urlSegments[0];
        }

        if (urlSegments.length > 1) {
            urlSegments.splice(0, 1);
            routeParams = urlSegments;
        }

        routeParams = routeParams.filter(param => param.length > 0);
        
        return {
            url: url,
            previousUrl: "",
            routeParams: routeParams
        };
    }

    componentDidMount() {
        this.setupRouter();
    }

    registerHelpers(){
        super.registerHelpers();
        this.registerRenderRouteComponentHelper();
    }

    isValidURL() {
        return location.href.match('/#/');
    }

    setupRouter () {  
        window.addEventListener('hashchange', (event) => {
            if(!this.isValidURL()){
                this.handleInvalidURL();
                return;
            }

            let completeUrl = event.newURL.split('#')[1];
            
            let urlData = this.getUrlData(completeUrl);
            urlData.previousUrl = event.oldURL.split('#')[1];

            //console.log(completeUrl, urlData);

            this.updateRoute(urlData);
        });
    }

    registerRenderRouteComponentHelper() {
        this._handlebars.registerHelper("renderRouteParameters", (path) => {
            let parameters = {};

            if (this.routes.hasOwnProperty(path) === true) {
                parameters = this.routes[path].parameters;
            }
            
            parameters.previousUrl = this.state.previousUrl;
            parameters.routeParams = this.state.routeParams;

            return parameters;
        });

        this._handlebars.registerHelper("renderRouteComponent", (activeRoute) => {
            this.unmountChildren();
            
            if (this.childrenComponents.hasOwnProperty(activeRoute)) {
                return activeRoute;
            }    
            else
                return 'notFound';
        });
    }

    updateRoute(urlData){
    
        this.setState({
            activeRoute: urlData.url,
            previousUrl: urlData.previousUrl,
            routeParams: urlData.routeParams
        });
    }
}


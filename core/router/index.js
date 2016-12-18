const Messages                  = use('core/messages');
const Errors                    = use('core/errors');

const makeRoute                 = require('./makeRoute');

const registeredRoutes = new Map();

class Router {
    static makeRoute (){
        return makeRoute.apply(this, arguments);
    }

    static addRoutes (routes) {
        if (!routes) {
            throw new Errors.Fatal('Routes definitions is missing');
        }

        routes.forEach((route) => {
            let handlersMap;

            if (!registeredRoutes.has(route.method)) {
                registeredRoutes.set(route.method, new Map());
            }
            handlersMap = registeredRoutes.get(route.method);

            if (handlersMap.has(route.pattern)) {
                throw new Errors.Fatal(`Route for ${route.method} ${route.pattern} is already defined`);
            }

            handlersMap.set(route.pattern, route);

        });

        return routes;
    };

    static handle (req, res) {
        const message = new Messages(req, res);
        const [args, handler] = findRoute(message.request.method, message.request.path);

        message.request.handler = handler;

        const handlers = [...Messages.request.getInterceptors(),
            handler.handler.bind(message, ...args),
            ...Messages.response.getInterceptors()];

        let messagePromise = Promise.resolve();
        handlers.forEach(function (interceptorFunction) {
            messagePromise = messagePromise.then(interceptorFunction.bind(message));
        });
        messagePromise
            .catch(function (error) {
                if (error instanceof Errors.NotFound) {
                    this.response.status = this.response.statuses._404_NotFound;
                } else if (error instanceof Errors.BadRequest) {
                    this.response.status = this.response.statuses._400_BadRequest;
                } else if (error instanceof Errors.Validation){
                    this.response.status = this.response.statuses._400_BadRequest;
                } else if (error instanceof Errors.Unauthorized) {
                    this.response.status = this.response.statuses._401_Unauthorized;
                } else if (error instanceof Errors.Forbidden) {
                    this.response.status = this.response.statuses._403_Forbidden;
                } else if (error instanceof Errors.Database && error.originalError.errno == 1451 /* ER_ROW_IS_REFERENCED_2 */){
                    this.response.status = this.response.statuses._409_Conflict;
                } else {
                    throw error;
                }
                return error;
            }.bind(message))
            .catch(function (error) {
                this.response.status = this.response.statuses._500_InternalServerError;
                return error;
            }.bind(message))
            .then(function (body) {
                this.response.body = body;
                this.response.send();
            }.bind(message));
    };
}

const findRoute = function (method, path) {
    const handlersMap = registeredRoutes.get(method);

    if (handlersMap) {
        const handlersIterator = handlersMap.keys();
        let regexpPattern, args;

        while (regexpPattern = handlersIterator.next().value) {
            if (args = regexpPattern.exec(path)) {
                return [args.slice(1), handlersMap.get(regexpPattern)];
            }
        }
    }

    return [[],makeRoute(method, function(){this.response.status = this.response.statuses._501_NotImplemented})];
};

module.exports = Router;
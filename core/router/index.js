const Messages = require('./../messages');
const Errors = require('./../errors');
const registeredRoutes = new Map();

const Router = () => {
};


Router.addRoutes = function (handlersDefinitions) {
    if (handlersDefinitions == null) {
        throw new Errors.Fatal('handlersDefinitions is missed');
    }

    handlersDefinitions.forEach((handler) => {
        let handlersMap;

        if (!registeredRoutes.has(handler.method)) {
            registeredRoutes.set(handler.method, new Map());
        }
        handlersMap = registeredRoutes.get(handler.method);

        if (handler.annotation.path) {

            let ArrAnnotation = handler.annotation.path;

            handlersMap.set(new RegExp(`^${ArrAnnotation}$`), handler);

        } else {

            if (handlersMap.has(handler.arguments.args.pattern)) {
                throw new Errors.Fatal(`Route for ${handler.method} ${handler.arguments.args.pattern} is already defined`);
            }

            handlersMap.set(handler.arguments.args.pattern, handler);

        }

    });

    return handlersDefinitions;
};


Router.handle = function (req, res) {
    const message = new Messages(req, res);
    const [args, handler] = findRoute(message.request.method, message.request.path);

    let permission;
    if (handler.annotations && handler.annotations.find(annotation => annotation.key === 'permission').length > 0){
        permission = handler.annotations.find(annotation => annotation.key === 'permission')[0];
    }
    else{
        permission = handler.permission;
    }

    message.request.handler = {
        permission,
        URLParameters: handler.arguments,
        annotations: handler.annotations
    };

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


Router.clear = function () {
    registeredRoutes.clear();
};

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

    return [[], {
        method,
        handler: function(){this.response.status = this.response.statuses._501_NotImplemented;},
        arguments: {},
        annotation: {},
        permission: null
    }];
};

module.exports = Router;
const Router                    = use('core/router');


const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];

const getHandlersDefinitions = function (controller) {

    const controllerRoot = controller.path.toLowerCase();
    const permissions = controller.permissions;

    const controllerHandlers = Object.keys(controller)
        .filter((key) => {
            if (['path', 'permissions'].includes(key)) {
                return false;
            }
            if (!allowedMethods.includes(key)) {
                throw new Errors.Fatal(`Method '${method}' is not recognized. Note, methods should be uppercase.`);
            }
            return true;
        });

    return controllerHandlers.reduce((routeHandlers, method) => {
        return routeHandlers.concat(controller[method].map(
            handler => Router.makeRoute(method, handler, controllerRoot, permissions[method])))
    }, []);
};

module.exports = getHandlersDefinitions;


const FN_ARGS = /^[^\(]*\([\{\s]*([^\)\}]*)[\}\s]*\)/m;
const FN_ARG_SPLIT = /,/;
const FN_ARG = /^\s*(\S+?)(id)?\s*(=\s*.+)?$/;
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ID_PATTERN_END = '/(\\d+)';
const ID_PATTERN = '/(\\d+)/';
const FN_GET_ANNOTATION = /\/\/\s+@(\w+):?\s(.*)/g;
const ID_OPTIONAL_START = '(?=.*';
const ID_OPTIONAL_END = '=([^&\\s]+)|.*)';
const ARRAY_VALUE = /\[(.*, )*(.*)]/gm;


const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE'];


const getHandlersDefinitions = function (controller) {

    const controllerRoot = controller.path.toLowerCase();
    let permissions = controller.permissions;

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
            (handler) => {
                let annotation = getAnnotation(handler, controllerRoot);
                return {
                    method,
                    handler,
                    arguments: getArguments(handler, controllerRoot),
                    annotation,
                    permission: annotation.permission ? annotation.permission : permissions[method]
                }
            })
        )

    }, []);
};

const getAnnotation = function (fn, controllerRoot) {
    let fnAnnotation = {};

    Function.prototype.toString.call(fn).toLowerCase().replace(FN_GET_ANNOTATION, function (a, key, parameter) {
        fnAnnotation[key] = parameter.match(ARRAY_VALUE) ? parameter.replace(/\[|]/g, "").split(', ') : parameter;
    });

    return fnAnnotation;
};

const getArguments = function (fn, controllerRoot) {
    let fnArguments = {
        args: {
            required: [],
            optional: []
        }
    };
    let argDecl;
    let fnTextVariable;

    fnTextVariable = Function.prototype.toString.call(fn).toLowerCase().replace(STRIP_COMMENTS, '');

    argDecl = fnTextVariable.match(FN_ARGS);
    argDecl[1].split(FN_ARG_SPLIT).forEach((arg) => {
        arg.replace(FN_ARG, (all, name, id, optional) => {
            fnArguments.args[optional ? 'optional' : 'required'].push({name, varName: name + (id || '')});
        });
    });

    fnArguments.args.pattern = getPatternForArgs(fnArguments.args, controllerRoot);

    return fnArguments;
};


const getPatternForArgs = function (args, controllerRoot) {
    let stringRegexp;

    if (args.length === 0) {
        stringRegexp = controllerRoot;
    } else {
        stringRegexp = _getStringRegexp(args, controllerRoot);
    }

    return new RegExp(`^${stringRegexp}$`);
};


const _getStringRegexp = function (args, controllerRoot) {

    let stringRegexp;
    let stringRegexpOptional_1;
    let stringRegexpOptional_2;

    if (args.required.length == 0) {
        stringRegexp = controllerRoot;
    } else {
        stringRegexp = args.required.reduce(function (previousValue, currentItem, index) {
            if (currentItem.name == controllerRoot) {
                return previousValue + currentItem.name + ID_PATTERN_END;
            } else {
                if (args.required.length - 1 == index && args.required.indexOf(controllerRoot)) {
                    return previousValue + currentItem.name + ID_PATTERN + controllerRoot;
                } else {
                    return previousValue + currentItem.name + ID_PATTERN;
                }
            }
        }, "");
    }

    if (args.optional.length > 0) {
        stringRegexpOptional_1 = args.optional.reduce(function (previousValue, currentItem) {
            return previousValue + ID_OPTIONAL_START + currentItem.name + ID_OPTIONAL_END;
        }, "(?:\\?");

        stringRegexpOptional_2 = args.optional.reduce(function (previousValue, currentItem, index) {
            if (args.optional.length - 1 !== index) {
                return previousValue + currentItem.name + "|";
            } else {
                return previousValue + currentItem.name;
            }
        }, "(?:&?(?:");

        stringRegexp += stringRegexpOptional_1 + stringRegexpOptional_2 + ")=[^&\\s]+)*)?";
    }

    return stringRegexp;
};

module.exports = getHandlersDefinitions;


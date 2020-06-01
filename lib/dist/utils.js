export var genRandomString = function () {
    return Math.random().toString(36).substring(2, 10);
};
export var defaultGenId = function () {
    return ([1e7].toString() + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
        return (c ^
            (window.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16);
    });
};
export var ensureArray = function (items) {
    return Array.isArray(items) ? items : [items];
};
export var createConstant = function (name, constant) {
    return name + "/" + constant;
};
export var createConstants = function (name, constants) {
    return constants.reduce(function (acc, constant) {
        acc[constant] = createConstant(name, constant);
        return acc;
    }, {});
};
export var wrapDispatchSubject = function (dispatch$) { return function (action) {
    dispatch$.next(action);
    return action;
}; };
export var getType = function (action) {
    return action.type.split('/', 2).join('/');
};

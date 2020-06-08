var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { BehaviorSubject } from 'rxjs';
import { getType } from './utils';
import { createStateRx } from './create-staterx';
var createActions = function (_a) {
    var constant = _a.constant, dispatch = _a.dispatch;
    return {
        merge: function (data) { return dispatch({ type: constant.MERGE, data: data }); }
    };
};
var createReducer = function (_a) {
    var constant = _a.constant;
    return function (state, action) {
        var type = getType(action);
        switch (type) {
            case constant.MERGE:
                return __assign(__assign({}, state), action.data);
            default:
                return state;
        }
    };
};
export var createObject = function (options) {
    if (options === void 0) { options = {}; }
    return createStateRx(options, {
        state$: new BehaviorSubject(options.default || {}),
        constants: ['MERGE'],
        createActions: createActions,
        createReducer: createReducer
    });
};

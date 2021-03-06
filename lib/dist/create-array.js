var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { BehaviorSubject } from 'rxjs';
import { getType } from './utils';
import { createStateRx } from './create-staterx';
import { map } from 'rxjs/operators';
var createSelectors = function (state$) {
    var byIndex = function (idx) { return state$.pipe(map(function (state) { return state[idx]; })); };
    var slice = function (start, end) {
        return state$.pipe(map(function (state) { return state.slice(start, end); }));
    };
    return {
        byIndex: byIndex,
        slice: slice
    };
};
var createActions = function (_a) {
    var constant = _a.constant, dispatch = _a.dispatch, get = _a.get;
    return {
        pop: function () { return dispatch({ type: constant.POP }); },
        push: function () {
            var data = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                data[_i] = arguments[_i];
            }
            return dispatch({ type: constant.PUSH, data: data });
        },
        shift: function () { return dispatch({ type: constant.SHIFT }); },
        unshift: function () {
            var data = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                data[_i] = arguments[_i];
            }
            return dispatch({ type: constant.UNSHIFT, data: data });
        },
        reverse: function () { return dispatch({ type: constant.REVERSE }); },
        sort: function (compareFn) {
            return dispatch({ type: constant.SORT, data: get().slice().sort(compareFn) });
        },
        splice: function (start, deleteCount) {
            var items = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                items[_i - 2] = arguments[_i];
            }
            return dispatch({
                type: constant.SPLICE,
                data: {
                    start: start,
                    deleteCount: deleteCount,
                    items: items
                }
            });
        }
    };
};
var createReducer = function (_a) {
    var constant = _a.constant;
    return function (state, action) {
        var type = getType(action);
        switch (type) {
            case constant.POP:
                var popClone = state.slice();
                popClone.pop();
                return popClone;
            case constant.PUSH:
                return __spreadArrays(state, action.data);
            case constant.UNSHIFT:
                return __spreadArrays(action.data, state);
            case constant.REVERSE:
                return state.slice().reverse();
            case constant.SHIFT:
                var shiftClone = state.slice();
                shiftClone.shift();
                return shiftClone;
            case constant.SORT:
                return action.data;
            case constant.SPLICE:
                var spliceClone = state.slice();
                spliceClone.splice.apply(spliceClone, __spreadArrays([action.data.start,
                    action.data.deleteCount], action.data.items));
                return spliceClone;
            default:
                return state;
        }
    };
};
export var createArray = function (options) {
    if (options === void 0) { options = {}; }
    return createStateRx(options, {
        state$: new BehaviorSubject(options.default || []),
        constants: ['POP', 'PUSH', 'REVERSE', 'UNSHIFT', 'SHIFT', 'SORT', 'SPLICE'],
        createActions: createActions,
        createReducer: createReducer,
        createSelectors: createSelectors
    });
};

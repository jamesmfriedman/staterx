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
import { map } from 'rxjs/operators';
import { ensureArray, defaultGenId, getType } from './utils';
import { createStateRx } from './create-staterx';
/*******************************************************
 * Actions
 *******************************************************/
var createActions = function (_a) {
    var constant = _a.constant, generateId = _a.generateId, defaultItem = _a.defaultItem, dispatch = _a.dispatch;
    return {
        create: function (items) {
            var ensureItem = (items || {});
            var newCreateItems = ensureArray(ensureItem).map(function (item) {
                if (item.id === undefined) {
                    item.id = generateId();
                }
                return __assign(__assign({}, defaultItem), item);
            });
            return dispatch({
                type: constant.CREATE,
                items: newCreateItems
            });
        },
        merge: function (items) {
            return dispatch({
                type: constant.MERGE,
                items: ensureArray(items)
            });
        },
        remove: function (items) {
            var wrappedItems = !Array.isArray(items) ? [items] : items;
            return dispatch({
                type: constant.REMOVE,
                items: ensureArray(typeof wrappedItems[0] === 'string'
                    ? wrappedItems.map(function (id) { return ({ id: id }); })
                    : wrappedItems)
            });
        },
        replace: function (items) {
            return dispatch({
                type: constant.REPLACE,
                items: ensureArray(items)
            });
        }
    };
};
/*******************************************************
 * Selectors
 *******************************************************/
var createSelectors = function (state$) {
    var all$ = state$.pipe(map(function (state) { return Object.values(state); }));
    var mapById$ = state$.pipe(map(function (state) { return state; }));
    var byId = function (id) { return state$.pipe(map(function (state) { return state[id]; })); };
    var byIds = function (ids) {
        return state$.pipe(map(function (state) {
            return ids.reduce(function (acc, id) {
                if (id) {
                    acc[id] = state[id || ''];
                }
                return acc;
            }, {});
        }));
    };
    var mapByKey = function (key) {
        return state$.pipe(map(function (state) {
            var items = state;
            return Object.values(items).reduce(function (acc, item) {
                if (!item) {
                    return acc;
                }
                var arr = (acc[item[key]] = acc[item[key]] || []);
                arr.push(item);
                return acc;
            }, {});
        }));
    };
    return {
        all$: all$,
        mapById$: mapById$,
        byId: byId,
        byIds: byIds,
        mapByKey: mapByKey
    };
};
/*******************************************************
 * Reducer
 *******************************************************/
var createReducer = function (_a) {
    var initialState = _a.initialState, constant = _a.constant;
    return function (state, action) {
        var items = ensureArray('items' in action ? action.items : []);
        var type = getType(action);
        switch (type) {
            case constant.CREATE:
                var newCreateItems = items.reduce(function (acc, item) {
                    acc[item.id] = __assign(__assign({}, (state[item.id] || {})), item);
                    return acc;
                }, {});
                return __assign(__assign({}, state), newCreateItems);
            case constant.MERGE:
                var newMergedItems = items.reduce(function (acc, item) {
                    acc[item.id] = __assign(__assign({}, (state[item.id] || {})), item);
                    return acc;
                }, {});
                return __assign(__assign({}, state), newMergedItems);
            case constant.REPLACE:
                var newReplaceItems = items.reduce(function (acc, item) {
                    acc[item.id] = item;
                    return acc;
                }, {});
                return __assign(__assign({}, state), newReplaceItems);
            case constant.REMOVE:
                var newRemoveItems = items.reduce(function (acc, item) {
                    delete acc[item.id];
                    return acc;
                }, __assign({}, state));
                return newRemoveItems;
            case constant.RESET:
                return initialState;
            default:
                return state;
        }
    };
};
export var createItems = function (initialState, options) {
    if (options === void 0) { options = {}; }
    var _a = options.generateId, generateId = _a === void 0 ? defaultGenId : _a, _b = options.defaultItem, defaultItem = _b === void 0 ? {} : _b;
    return createStateRx(initialState, options, {
        state$: new BehaviorSubject(initialState),
        constants: ['SET', 'CREATE', 'REPLACE', 'REMOVE', 'MERGE', 'RESET'],
        createActions: function (props) {
            return createActions(__assign(__assign({}, props), { generateId: generateId, defaultItem: defaultItem }));
        },
        createReducer: createReducer,
        createSelectors: createSelectors
    });
};

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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { Subject, merge } from 'rxjs';
import { genRandomString, createConstants, wrapDispatchSubject } from './utils';
import { distinctUntilChanged, map, mergeMap } from 'rxjs/operators';
var DEFAULT_CONSTANTS = ['SET', 'RESET'];
var createBaseActions = function (_a) {
    var constant = _a.constant, get = _a.get, _b = _a.dispatch$, dispatch$ = _b === void 0 ? new Subject() : _b, _c = _a._dispatchers$, _dispatchers$ = _c === void 0 ? new Subject() : _c;
    var action$ = merge(dispatch$, _dispatchers$.pipe(mergeMap(function (obs$) { return obs$; })));
    var dispatch = wrapDispatchSubject(dispatch$);
    return {
        action$: action$,
        set: function (data) {
            // @ts-ignore
            data = typeof data === 'function' ? data(get()) : data;
            return dispatch({ type: constant.SET, data: data });
        },
        reset: function () { return dispatch({ type: constant.RESET }); },
        dispatch: dispatch,
        _dispatchers$: _dispatchers$
    };
};
var createBaseReducer = function (_a) {
    var initialState = _a.initialState, constant = _a.constant, reducer = _a.reducer;
    return function (state, action) {
        var type = action.type.split('/', 2).join('/');
        switch (type) {
            case constant.SET:
                return action.data;
            case constant.RESET:
                return initialState;
            default:
                return reducer(state, action);
        }
    };
};
export var createStateRx = function (initialState, options, overrides) {
    if (options === void 0) { options = {}; }
    var _a;
    var _b = options.name, name = _b === void 0 ? genRandomString() : _b, _c = options.autoRun, autoRun = _c === void 0 ? true : _c;
    var state$ = overrides.state$, constants = overrides.constants, createReducer = overrides.createReducer, createActions = overrides.createActions, createSelectors = overrides.createSelectors;
    var constant = createConstants(name, __spreadArrays(DEFAULT_CONSTANTS, constants));
    var get = function () { return state$.getValue(); };
    var _d = createBaseActions({
        constant: constant,
        get: get
    }), action$ = _d.action$, dispatch = _d.dispatch, baseActions = __rest(_d, ["action$", "dispatch"]);
    var actions = __rest(createActions({
        constant: constant,
        get: get,
        dispatch: dispatch
    }), []);
    var selectors = createSelectors === null || createSelectors === void 0 ? void 0 : createSelectors(state$);
    var reducer = createBaseReducer({
        constant: constant,
        initialState: initialState,
        reducer: createReducer({
            constant: constant,
            initialState: initialState
        })
    });
    var _reducer$ = action$.pipe(map(function (action) { return reducer(state$.getValue(), action); }), distinctUntilChanged());
    var run = function () { return _reducer$.subscribe(state$); };
    var api = __assign(__assign(__assign(__assign({}, actions), selectors), baseActions), { name: name,
        state$: state$,
        action$: action$,
        constant: constant,
        run: run,
        get: get,
        dispatch: dispatch,
        _reducer$: _reducer$ });
    var effects = (_a = options.effects) === null || _a === void 0 ? void 0 : _a.call(options, api);
    autoRun && run();
    return __assign(__assign({}, api), effects);
};

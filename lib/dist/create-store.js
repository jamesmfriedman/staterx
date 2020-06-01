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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { merge, Subject, BehaviorSubject } from 'rxjs';
import { map, scan, distinctUntilChanged } from 'rxjs/operators';
import { wrapDispatchSubject } from './utils';
export var createStore = function (observables, initialState) {
    if (initialState === void 0) { initialState = {}; }
    var stateRxBranches = Object.values(observables).filter(function (branch) { return 'state$' in branch; });
    // Create dispatch function and add to all of our branches
    var dispatch$ = new Subject();
    stateRxBranches.forEach(function (branch) {
        branch._dispatchers$.next(dispatch$);
    });
    // Create Normalized State {[stateKey]: observable}
    var normalizedObservables = Object.entries(observables).map(function (_a) {
        var key = _a[0], input = _a[1];
        var obs = 'state$' in input ? input.state$ : input;
        return obs.pipe(distinctUntilChanged(), map(function (val) {
            var _a;
            return (_a = {}, _a[key] = val, _a);
        }));
    });
    var state$ = new BehaviorSubject(initialState);
    var reducer$ = merge.apply(void 0, normalizedObservables).pipe(scan(function (acc, val) {
        return __assign(__assign({}, acc), val);
    }, initialState));
    var action$ = merge.apply(void 0, __spreadArrays([dispatch$], stateRxBranches.map(function (state) { return state.action$; }))).pipe(distinctUntilChanged());
    reducer$.subscribe(state$);
    var setState = function (newState) {
        for (var key in newState) {
            var obs = observables[key];
            var newValue = newState[key];
            if ('state$' in obs) {
                obs.state$.next(newValue);
            }
            else if ('next' in obs) {
                obs.next(newValue);
            }
            else {
                console.warn("Cannot set store value of " + key + ". It is not a StateRx Objects or subject.");
            }
        }
    };
    var getState = function () { return state$.getValue(); };
    return {
        state$: state$,
        action$: action$,
        dispatch: wrapDispatchSubject(dispatch$),
        initialState: initialState,
        setState: setState,
        getState: getState
    };
};

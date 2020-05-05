import { BehaviorSubject } from 'rxjs';
import { createStateRx } from './create-staterx';
export var createValue = function (initialState, options) {
    if (options === void 0) { options = {}; }
    return createStateRx(initialState, options, {
        state$: new BehaviorSubject(initialState),
        constants: [],
        createActions: function () { return ({}); },
        createReducer: function () { return function (state) { return state; }; }
    });
};

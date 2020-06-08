import { BehaviorSubject } from 'rxjs';
import { createStateRx } from './create-staterx';
export var createValue = function (options) {
    if (options === void 0) { options = {}; }
    return createStateRx(options, {
        state$: new BehaviorSubject(options.default),
        constants: [],
        createActions: function () { return ({}); },
        createReducer: function () { return function (state) { return state; }; }
    });
};

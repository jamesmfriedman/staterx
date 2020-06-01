import { createValue } from './create-value';
import { Subject } from 'rxjs';
describe('createValue', function () {
    it('with options', function () {
        var state = createValue(0, {
            name: 'test',
            autoRun: true,
            effects: function () { },
            reducer: function (state) { return state; }
        });
        expect(state.name).toBe('test');
    });
    it('clone', function () {
        var state = createValue(0);
        expect(state.clone().get()).toBe(0);
        expect(state.clone(1).get()).toBe(1);
    });
    it('_dispatchers$', function () {
        var state = createValue(0);
        state._dispatchers$.next(new Subject());
    });
    it('get', function () {
        var state = createValue(0);
        expect(state.get()).toBe(0);
    });
    it('set', function () {
        var state = createValue(0);
        // direct set
        state.set(1);
        expect(state.get()).toBe(1);
        // as function
        state.set(function (val) {
            expect(val).toBe(1);
            return 2;
        });
        expect(state.get()).toBe(2);
    });
    it('reset', function () {
        var state = createValue(0);
        state.set(1);
        state.reset();
        expect(state.get()).toBe(0);
    });
    it('state$', function (done) {
        var state = createValue(0);
        state.state$.subscribe(function (val) {
            expect(val).toBe(0);
            done();
        });
    });
    it('action$', function (done) {
        var state = createValue(0);
        state.action$.subscribe(function (val) {
            expect(val).toEqual({ type: state.name + "/SET", data: 1 });
            done();
        });
        state.set(1);
    });
    it('dispatch', function (done) {
        var state = createValue(0);
        state.action$.subscribe(function (val) {
            expect(val).toEqual({ type: 'test' });
            done();
        });
        state.dispatch({ type: 'test' });
    });
    it('custom reducer', function (done) {
        var state = createValue(0, {
            reducer: function (state, action) {
                switch (action.type) {
                    case 'hello':
                        return 100;
                    default:
                        return state;
                }
            }
        });
        state.dispatch({ type: 'hello' });
        state.state$.subscribe(function (val) {
            expect(val).toBe(100);
            done();
        });
    });
});

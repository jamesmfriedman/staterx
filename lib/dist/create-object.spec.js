import { createObject } from './create-object';
describe('createObject', function () {
    it('with options', function () {
        var state = createObject({
            default: { test: 'foo' },
            key: 'test',
            autoRun: true,
            effects: function () { },
            reducer: function (state) { return state; }
        });
        expect(state.key).toBe('test');
    });
    it('get', function () {
        var state = createObject({ default: { test: 'foo' } });
        expect(state.get()).toEqual({ test: 'foo' });
    });
    it('set', function () {
        var state = createObject({ default: { test: 'foo' } });
        state.set({ test: 'baz' });
        expect(state.get()).toEqual({ test: 'baz' });
    });
    it('reset', function () {
        var state = createObject({ default: { test: 'foo' } });
        state.set({ test: 'baz' });
        state.reset();
        expect(state.get()).toEqual({ test: 'foo' });
    });
    it('merge', function () {
        var state = createObject({
            default: { test: 'foo' }
        });
        state.merge({ hello: 'world' });
        expect(state.get()).toEqual({ test: 'foo', hello: 'world' });
    });
    it('state$', function (done) {
        var state = createObject({ default: { test: 'foo' } });
        state.state$.subscribe(function (val) {
            expect(val).toEqual({ test: 'foo' });
            done();
        });
    });
    it('action$', function (done) {
        var state = createObject({ default: { test: 'foo' } });
        state.action$.subscribe(function (val) {
            expect(val).toEqual({ type: state.key + "/SET", data: { test: 'baz' } });
            done();
        });
        state.set({ test: 'baz' });
    });
    it('dispatch', function (done) {
        var state = createObject({ default: { test: 'foo' } });
        state.action$.subscribe(function (val) {
            expect(val).toEqual({ type: 'test' });
            done();
        });
        state.dispatch({ type: 'test' });
    });
});

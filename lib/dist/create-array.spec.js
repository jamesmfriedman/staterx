import { createArray } from './create-array';
describe('createObject', function () {
    it('with options', function () {
        var state = createArray({
            key: 'test',
            autoRun: true,
            effects: function () { },
            reducer: function (state) { return state; }
        });
        expect(state.key).toBe('test');
    });
    it('get', function () {
        var state = createArray({ default: [0] });
        expect(state.get()).toEqual([0]);
    });
    it('set', function () {
        var state = createArray({ default: [0] });
        state.set([1]);
        expect(state.get()).toEqual([1]);
    });
    it('reset', function () {
        var state = createArray({ default: [0] });
        state.set([1]);
        state.reset();
        expect(state.get()).toEqual([0]);
    });
    it('state$', function (done) {
        var state = createArray({ default: [0] });
        state.state$.subscribe(function (val) {
            expect(val).toEqual([0]);
            done();
        });
    });
    it('action$', function (done) {
        var state = createArray({ default: [0] });
        state.action$.subscribe(function (val) {
            expect(val).toEqual({ type: state.key + "/SET", data: [1] });
            done();
        });
        state.set([1]);
    });
    it('dispatch', function (done) {
        var state = createArray({ default: [0] });
        state.action$.subscribe(function (val) {
            expect(val).toEqual({ type: 'test' });
            done();
        });
        state.dispatch({ type: 'test' });
    });
    it('pop', function () {
        var state = createArray({ default: [0] });
        state.pop();
        expect(state.get()).toEqual([]);
    });
    it('push', function () {
        var state = createArray({ default: [0] });
        state.push(1, 2, 3);
        expect(state.get()).toEqual([0, 1, 2, 3]);
    });
    it('shift', function () {
        var state = createArray({ default: [0, 1] });
        state.shift();
        expect(state.get()).toEqual([1]);
    });
    it('unshift', function () {
        var state = createArray({ default: [2, 3] });
        state.unshift(0, 1);
        expect(state.get()).toEqual([0, 1, 2, 3]);
    });
    it('reverse', function () {
        var state = createArray({ default: [1, 2, 3] });
        state.reverse();
        expect(state.get()).toEqual([3, 2, 1]);
    });
    it('sort', function () {
        var state = createArray({ default: [3, 1, 2, 4] });
        state.sort(function (a, b) { return a - b; });
        expect(state.get()).toEqual([1, 2, 3, 4]);
    });
    it('splice', function () {
        var state = createArray({ default: [1, 2, 3] });
        state.splice(0, 1);
        expect(state.get()).toEqual([2, 3]);
    });
    it('byIndex', function (done) {
        var state = createArray({ default: [1, 2, 3] });
        state.byIndex(1).subscribe(function (val) {
            expect(val).toBe(2);
            done();
        });
    });
    it('slice', function (done) {
        var state = createArray({ default: [1, 2, 3] });
        state.slice(1).subscribe(function (val) {
            expect(val).toEqual([2, 3]);
            done();
        });
    });
});

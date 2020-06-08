import { createItems } from './create-items';
describe('createItems', function () {
    var items = {
        '1': { id: '1', text: 'test' },
        '2': { id: '2', text: 'test' }
    };
    it('with options', function () {
        var state = createItems({
            key: 'test',
            default: items,
            autoRun: true,
            effects: function () { },
            reducer: function (state) { return state; },
            generateId: function () { return String(Math.random()); },
            defaultItem: { text: 'test' }
        });
        expect(state.key).toBe('test');
    });
    it('get', function () {
        var state = createItems({ default: items });
        expect(state.get()).toEqual(items);
    });
    it('set', function () {
        var state = createItems({ default: items });
        state.set({});
        expect(state.get()).toEqual({});
    });
    it('reset', function () {
        var state = createItems({ default: items });
        state.set({});
        state.reset();
        expect(state.get()).toEqual(items);
    });
    it('state$', function (done) {
        var state = createItems({ default: items });
        state.state$.subscribe(function (val) {
            expect(val).toEqual(items);
            done();
        });
    });
    it('action$', function (done) {
        var state = createItems({ default: items });
        state.action$.subscribe(function (val) {
            expect(val).toEqual({ type: state.key + "/SET", data: {} });
            done();
        });
        state.set({});
    });
    it('dispatch', function (done) {
        var state = createItems({ default: items });
        state.action$.subscribe(function (val) {
            expect(val).toEqual({ type: 'test' });
            done();
        });
        state.dispatch({ type: 'test' });
    });
    it('create', function () {
        var _a;
        var state = createItems();
        var state2 = createItems({
            defaultItem: function () { return ({}); }
        });
        // with item
        state.create({ text: 'test' });
        // without object
        state.create();
        // test defaultItem as function
        state2.create();
        expect((_a = Object.values(state.get())[0]) === null || _a === void 0 ? void 0 : _a.text).toEqual('test');
    });
    it('update', function () {
        var state = createItems({
            default: { test: { id: 'test', text: 'one' } }
        });
        state.update({ id: 'test', text: 'two' });
        expect(state.get()).toEqual({ test: { id: 'test', text: 'two' } });
    });
    it('replace', function () {
        var state = createItems({
            default: { test: { id: 'test', text: 'one' } }
        });
        state.replace({ id: 'test', text: 'two' });
        expect(state.get()).toEqual({ test: { id: 'test', text: 'two' } });
    });
    it('remove', function () {
        var state = createItems({ default: items });
        state.remove('1');
        expect(state.get()).toEqual({ '2': { id: '2', text: 'test' } });
        state.remove(['1', '2']);
    });
    it('all$', function (done) {
        var state = createItems({ default: items });
        state.all$.subscribe(function (val) {
            expect(val).toEqual(Object.values(items));
            done();
        });
    });
    it('byId', function (done) {
        var state = createItems({ default: items });
        state.byId('1').subscribe(function (val) {
            expect(val).toEqual(items['1']);
            done();
        });
    });
    it('byIds', function (done) {
        var state = createItems({ default: items });
        state.byIds(['1', '2']).subscribe(function (val) {
            expect(val).toEqual(items);
            done();
        });
    });
    it('mapByKey', function (done) {
        var state = createItems({ default: items });
        state.mapByKey('text').subscribe(function (val) {
            expect(val).toEqual({
                test: [
                    { id: '1', text: 'test' },
                    { id: '2', text: 'test' }
                ]
            });
            done();
        });
    });
});

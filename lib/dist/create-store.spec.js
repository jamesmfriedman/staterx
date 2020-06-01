import { createStore } from './create-store';
import { createValue } from './create-value';
import { BehaviorSubject, of } from 'rxjs';
describe('createStore', function () {
    it('creates', function () {
        var _a, _b;
        var s1 = createValue(0);
        var s2 = createValue(1);
        var store = createStore((_a = {},
            _a[s1.name] = s1,
            _a[s2.name] = s2,
            _a), {});
        expect(store.getState()).toEqual((_b = {}, _b[s1.name] = 0, _b[s2.name] = 1, _b));
    });
    it('setState', function () {
        var _a, _b, _c;
        var s1 = createValue(0);
        var s2 = createValue(1);
        var s3 = new BehaviorSubject(2);
        var s4 = of(3);
        var store = createStore((_a = {},
            _a[s1.name] = s1,
            _a[s2.name] = s2,
            _a.s3 = s3,
            _a.s4 = s4,
            _a));
        store.setState((_b = {},
            _b[s1.name] = 1,
            _b[s2.name] = 2,
            _b.s3 = 3,
            _b.s4 = 4,
            _b));
        expect(store.getState()).toEqual((_c = {},
            _c[s1.name] = 1,
            _c[s2.name] = 2,
            _c.s3 = 3,
            _c.s4 = 3,
            _c));
    });
});

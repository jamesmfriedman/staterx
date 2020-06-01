import { renderHook, act } from '@testing-library/react-hooks';
import { createValue } from './create-value';
import { useRx } from './react';
import { map } from 'rxjs/operators';
describe('react', function () {
    it('useRx', function () {
        var state = createValue(0);
        // Override the default value and inject our mock _getTime function
        var _a = renderHook(function () { return useRx(state.state$); }), result = _a.result, rerender = _a.rerender;
        expect(result.current).toBe(0);
        act(function () {
            state.set(1);
        });
        rerender();
        expect(result.current).toBe(1);
    });
    it('useRx error', function () {
        var state = createValue(0);
        expect(function () {
            return renderHook(function () {
                return useRx(function () {
                    return state.state$.pipe(map(function () {
                        throw Error('Test');
                    }));
                });
            });
        }).toThrow();
    });
});

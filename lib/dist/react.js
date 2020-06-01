import { useState, useLayoutEffect, useMemo } from 'react';
export function useRx(obsInput$, deps) {
    var obs$ = useMemo(function () { return (typeof obsInput$ === 'function' ? obsInput$() : obsInput$); }, deps);
    var _a = useState(
    // @ts-ignore
    'getValue' in obs$ ? obs$.getValue() : undefined), value = _a[0], setValue = _a[1];
    // subscribe to observable
    useLayoutEffect(function () {
        var sub = obs$.subscribe(setValue, function (err) {
            setValue(function () {
                throw err;
            });
        });
        return function () {
            sub.unsubscribe();
        };
    }, [obs$]);
    return value;
}

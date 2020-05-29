import { useState, useLayoutEffect, useMemo } from 'react';
export function useRx(obs$, initialValue) {
    var _a = useState('getValue' in obs$
        ? obs$.getValue()
        : initialValue !== null && initialValue !== void 0 ? initialValue : undefined), value = _a[0], setValue = _a[1];
    var _b = useState(), error = _b[0], setError = _b[1];
    // subscribe to observable
    useLayoutEffect(function () {
        var sub = obs$.subscribe(setValue, setError);
        return function () {
            sub.unsubscribe();
        };
    }, [obs$]);
    return [value, error];
}
export function useRxMemo(obsFactory, deps, initialValue) {
    var obs$ = useMemo(obsFactory, deps);
    return useRx(obs$, initialValue);
}

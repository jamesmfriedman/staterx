import { distinctUntilChanged } from 'rxjs/operators';
export var connectDevTools = function (store) {
    var extension = typeof window !== undefined && window.__REDUX_DEVTOOLS_EXTENSION__;
    if (!extension) {
        console.error('No Redux Dev Tools extension detected');
    }
    var dev = extension.connect({ name: 'StateRx' });
    // init the store
    dev.init(store.initialState);
    // send new actions
    store.action$.pipe(distinctUntilChanged()).subscribe({
        next: function (action) { return dev.send(action, store.state$.value); },
        error: function (err) { return dev.error(err); }
    });
    // listen to dispatches
    dev.subscribe(function (data) {
        switch (data.type) {
            case 'DISPATCH':
                if (data.payload.type === 'JUMP_TO_ACTION') {
                    store.setState(JSON.parse(data.state));
                }
                break;
            case 'ACTION':
                var action = data.payload && JSON.parse(data.payload);
                action && store.dispatch(action);
                break;
        }
    });
};

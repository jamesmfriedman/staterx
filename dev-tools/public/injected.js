(function () {
  const send = (evtKey, data) => {
    window.postMessage(
      { type: `stateRx.${evtKey}`, ...data, timestamp: Date.now() },
      '*'
    );
  };

  const watchRxObject = (rxObj) => {
    const key = rxObj.key;

    rxObj.state$.subscribe((state) => {
      send('object.change', {
        key,
        state
      });
    });

    rxObj.action$.subscribe((action) => {
      send('object.action', {
        key,
        state: rxObj.get(),
        action
      });
    });

    send('object.change', {
      key,
      state: rxObj.get()
    });
  };

  const init = () => {
    window.addEventListener('stateRx.debugger', (evt) => {
      const msg = evt.detail;
      let rxObj;
      console.log('debugger msg', msg);
      switch (msg.type) {
        case 'stateRx.object.change':
          rxObj = window.StateRx.objects[msg.key];
          rxObj && rxObj.set(msg.state);
          break;
        case 'stateRx.object.viewHistoryStep':
          rxObj = window.StateRx.objects[msg.key];
          rxObj && rxObj.state$.next(msg.state);
          break;
        default:
          console.info('Unhandled StateRx debug event', msg);
      }
    });

    for (const key in window.StateRx.objects) {
      watchRxObject(window.StateRx.objects[key]);
    }

    console.log('Initializing StateRx DevTools');
  };

  init();
})();

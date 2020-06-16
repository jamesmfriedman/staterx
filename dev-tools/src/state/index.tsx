import { createItems, createValue, AnyAction } from 'staterx';
import { bridge } from '@common/bridge';

const mockData = new Array(100).fill(undefined).reduce(
  (acc) => {
    const id = Math.random().toString(36).substring(2, 10);
    acc[id] = {
      id: id,
      key: id,
      state: 'red',
      history: [
        { type: 'action', state: 'orange', timestamp: Date.now() },
        { type: 'action', state: 'red', timestamp: Date.now() },
        { type: 'action', state: 'blue', timestamp: Date.now() },
        { type: 'action', state: 'green', timestamp: Date.now() },
        { type: 'action', state: 'purple', timestamp: Date.now() },
        { type: 'action', state: 'orange', timestamp: Date.now() },
        { type: 'action', state: 'red', timestamp: Date.now() },
        { type: 'action', state: 'blue', timestamp: Date.now() },
        { type: 'action', state: 'green', timestamp: Date.now() },
        { type: 'action', state: 'purple', timestamp: Date.now() },
        { type: 'action', state: 'orange', timestamp: Date.now() },
        { type: 'action', state: 'red', timestamp: Date.now() },
        { type: 'action', state: 'blue', timestamp: Date.now() },
        { type: 'action', state: 'green', timestamp: Date.now() },
        { type: 'action', state: 'purple', timestamp: Date.now() },
        { type: 'action', state: 'orange', timestamp: Date.now() },
        { type: 'action', state: 'red', timestamp: Date.now() },
        { type: 'action', state: 'blue', timestamp: Date.now() },
        { type: 'action', state: 'green', timestamp: Date.now() },
        { type: 'action', state: 'purple', timestamp: Date.now() },
        { type: 'action', state: 'orange', timestamp: Date.now() },
        { type: 'action', state: 'red', timestamp: Date.now() },
        { type: 'action', state: 'blue', timestamp: Date.now() },
        { type: 'action', state: 'green', timestamp: Date.now() },
        { type: 'action', state: 'purple', timestamp: Date.now() }
      ]
    };

    return acc;
  },
  {
    json: {
      id: 'json',
      key: 'json',
      state: { hello: 'world', foo: 'baz' },
      history: []
    }
  }
);

type HistoryT = {
  action: AnyAction;
  state: any;
  timestamp: number;
};

const initialState: {
  [key: string]: {
    id: string;
    key: string;
    state: any;
    history: HistoryT[];
  };
} = process.env.NODE_ENV === 'development' ? mockData : {};

export const objects = createItems({
  default: initialState,
  defaultItem: { history: [] },
  effects: () => ({
    addHistory: (key: string, history: HistoryT) => {
      const prevHistory = objects.get()[key]?.history || [];
      objects.update({
        id: key,
        key: key,
        state: history.state,
        history: [...prevHistory, history]
      });
    }
  })
});

export const viewObject = createValue({
  default: ''
});

bridge.events.subscribe((msg) => {
  console.log(msg);
  switch (msg.type) {
    case 'stateRx.object.change':
      objects.update({ id: msg.key, key: msg.key, state: msg.state });
      break;
    case 'stateRx.object.action':
      objects.addHistory(msg.key, {
        action: msg.action,
        state: msg.state,
        timestamp: msg.timestamp
      });
      break;
    default:
      console.info('Unhandled debugger event', msg);
  }
});

if (process.env.NODE_ENV === 'production') {
  // Create a connection to the background page
  var backgroundPageConnection = chrome.runtime.connect({
    name: 'panel'
  });

  backgroundPageConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
  });

  backgroundPageConnection.onMessage.addListener(function (msg: any) {
    bridge.events.next(msg);
  });
}

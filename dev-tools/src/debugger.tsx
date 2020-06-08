/* global chrome */
import { Subject } from 'rxjs';
import { createItems, createValue } from 'staterx';
import { AnyAction } from 'staterx/dist/utils';

const mockData = new Array(100).fill(undefined).reduce((acc) => {
  const id = Math.random();
  acc[id] = { id: id, key: id, state: 'red', history: [] };

  return acc;
}, {});

export const send = (evt: DebuggerEvent) => {
  try {
    chrome.devtools.inspectedWindow.eval(
      `window.dispatchEvent(new CustomEvent('stateRx.debugger', {
      detail: ${JSON.stringify(evt)}
    }));`
    );
  } catch (err) {
    console.error(err);
  }
};

export const initDebugger = () => {
  // chrome.tabs.onUpdated.addListener(function (tabId: any, changes: any) {
  //   if (
  //     tabId === chrome.devtools.inspectedWindow.tabId &&
  //     changes.status == 'complete'
  //   ) {
  //     objects.reset();
  //     viewObject.reset();
  //     injectDebugger();
  //   }
  // });
  injectDebugger();
};

const injectDebugger = () => {
  // load injected script
  var xhr = new XMLHttpRequest();
  xhr.addEventListener('load', function (evt) {
    chrome.devtools.inspectedWindow.eval(xhr.responseText);
  });

  xhr.open('GET', chrome.extension.getURL('/injected.js'));
  xhr.send();
};

type ObjectUpdatedEventT = {
  type: 'stateRx.object.change';
  key: string;
  state: any;
  timestamp: number;
};

type ObjectActionEventT = {
  type: 'stateRx.object.action';
  key: string;
  state: any;
  action: AnyAction;
  timestamp: number;
};

type ObjectHistoryEventT = {
  type: 'stateRx.object.viewHistoryStep';
  key: string;
  state: any;
};

type DebuggerEvent =
  | ObjectUpdatedEventT
  | ObjectActionEventT
  | ObjectHistoryEventT;

export const debuggerEvents = new Subject<DebuggerEvent>();

const initialState: {
  [key: string]: {
    id: string;
    key: string;
    state: any;
    history: Array<{
      action: AnyAction;
      state: any;
      timestamp: number;
    }>;
  };
} = process.env.NODE_ENV === 'development' ? mockData : {};

export const objects = createItems({
  default: initialState,
  defaultItem: { history: [] }
});

export const viewObject = createValue({
  default: ''
});

debuggerEvents.subscribe((msg) => {
  console.log(msg);
  switch (msg.type) {
    case 'stateRx.object.change':
      objects.update({ id: msg.key, key: msg.key, state: msg.state });
      break;
    case 'stateRx.object.action':
      const history = objects.get()[msg.key]?.history || [];
      const newHistory = {
        action: msg.action,
        state: msg.state,
        timestamp: msg.timestamp
      };

      objects.update({
        id: msg.key,
        key: msg.key,
        state: msg.state,
        history: [...history, newHistory]
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
    debuggerEvents.next(msg);
  });
}

/* global chrome */
import { Subject } from 'rxjs';
import { AnyAction } from 'staterx';

/**************************************************
 * Utils
 **************************************************/
const inspectedWindowHasDebugger = () =>
  new Promise((resolve) => {
    chrome.devtools.inspectedWindow.eval(
      `window._StateRxDevTools`,
      (result: any) => {
        resolve(!!result);
      }
    );
  });

const injectDebugger = async () => {
  const hasDebugger = await inspectedWindowHasDebugger();

  if (hasDebugger) {
    return;
  }

  // load injected script
  var xhr = new XMLHttpRequest();
  xhr.addEventListener('load', function (evt) {
    chrome.devtools.inspectedWindow.eval(xhr.responseText);
  });

  xhr.open('GET', chrome.extension.getURL('/injected.js'));
  xhr.send();
};

const send = (evt: DebuggerEvent) => {
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

/**************************************************
 * Api
 **************************************************/

const init = () => {
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

/**************************************************
 * Events
 **************************************************/

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

const events = new Subject<DebuggerEvent>();

export const bridge = {
  init,
  events,
  send
};

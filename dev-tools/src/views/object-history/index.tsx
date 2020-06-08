import React from 'react';
import styles from './index.module.css';
import { useRx } from 'staterx';
import { objects, viewObject, send } from '../../debugger';

export function ObjectHistory() {
  const selectedId = useRx(viewObject.state$);
  const obj = useRx(() => objects.byId(selectedId), [selectedId]);
  return (
    <div className={styles.view}>
      <header>History</header>
      {obj?.history.map((entry) => (
        <div
          onClick={() =>
            send({
              type: 'stateRx.object.viewHistoryStep',
              key: obj.key,
              state: entry.state
            })
          }
        >
          {JSON.stringify(entry)}
        </div>
      ))}
    </div>
  );
}

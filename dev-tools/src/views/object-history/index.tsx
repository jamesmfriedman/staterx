import React from 'react';
import styles from './index.module.css';
import { useRx } from 'staterx';
import { objects, viewObject } from '@state';
import { bridge } from '@common/bridge';
import { useLocalSearch } from '@src/common/hooks';

export function ObjectHistory() {
  const selectedId = useRx(viewObject.state$);
  const obj = useRx(() => objects.byId(selectedId), [selectedId]);
  const history = obj?.history;
  const { term, setTerm, items } = useLocalSearch(history || []);

  return (
    <div className={styles.view}>
      <header>
        History &nbsp;
        <input
          type="search"
          placeholder="Filter"
          value={term}
          onChange={(evt) => setTerm(evt.currentTarget.value)}
        />
      </header>
      <ul>
        {items.map((entry, index) => (
          <li
            key={index}
            onClick={() =>
              bridge.send({
                type: 'stateRx.object.viewHistoryStep',
                key: obj!.key,
                state: entry.state
              })
            }
          >
            {JSON.stringify(entry)}
          </li>
        ))}
      </ul>
    </div>
  );
}

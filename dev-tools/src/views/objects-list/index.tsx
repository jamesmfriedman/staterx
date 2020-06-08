import React, { useState } from 'react';
import classnames from 'classnames';
import styles from './index.module.css';
import { useRx } from 'staterx';
import { objects, viewObject } from '../../debugger';

export function ObjectsList() {
  const allObjects = useRx(objects.all$) || [];
  const selectedId = useRx(viewObject.state$);
  const [term, setTerm] = useState('');

  const cleanedTerm = term.toLowerCase().trim();
  const filtered = cleanedTerm
    ? allObjects.filter((val) =>
        String(val.key).toLowerCase().includes(cleanedTerm)
      )
    : allObjects;

  return (
    <div className={styles.list}>
      <header className={styles.header}>
        <input
          type="search"
          placeholder="Filter"
          value={term}
          onChange={(evt) => setTerm(evt.currentTarget.value)}
        />
      </header>
      <ul>
        {filtered.map((obj) => {
          return (
            <li
              key={obj.key}
              className={classnames(styles.item, {
                [styles.itemActive]: obj.id === selectedId
              })}
              onClick={() => viewObject.set(obj.id)}
            >
              {obj.key}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

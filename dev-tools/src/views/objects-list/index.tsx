import React, { useState } from 'react';
import classnames from 'classnames';
import styles from './index.module.css';
import { useRx } from 'staterx';
import { objects, viewObject } from '@state';
import { useLocalSearch } from '@src/common/hooks';

export function ObjectsList() {
  const allObjects = useRx(objects.all$) || [];
  const selectedId = useRx(viewObject.state$);
  const { term, setTerm, items } = useLocalSearch(allObjects, ['key', 'state']);

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
        {items.map((obj) => {
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

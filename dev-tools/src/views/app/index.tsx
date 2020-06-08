import React from 'react';
import SplitPane from 'react-split-pane';
import styles from './index.module.css';

import { ObjectsList } from '../objects-list';
import { ObjectEditor } from '../object-editor';
import { ObjectHistory } from '../object-history';

function App() {
  return (
    <div className={styles.app}>
      <SplitPane split="vertical" defaultSize="50%">
        <ObjectsList />
        <SplitPane split="horizontal" defaultSize="50%">
          <ObjectEditor />
          <ObjectHistory />
        </SplitPane>
      </SplitPane>
    </div>
  );
}

export default App;

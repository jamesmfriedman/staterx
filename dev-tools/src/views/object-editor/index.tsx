import React, { useState, useEffect } from 'react';
import styles from './index.module.css';
import { objects, viewObject, send } from '../../debugger';
import { useRx } from 'staterx';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';

export function ObjectEditor() {
  const selectedId = useRx(viewObject.state$);
  const obj = useRx(() => objects.byId(selectedId), [selectedId]);
  const [value, setValue] = useState(obj?.state);

  const safeParseJSON = (val: any) => {
    try {
      return JSON.parse(val);
    } catch (err) {
      return val;
    }
  };

  useEffect(() => {
    setValue(obj?.state);
  }, [obj?.state]);

  return (
    <div className={styles.view}>
      {obj ? (
        <>
          <header>
            State: {obj.key}{' '}
            <button
              onClick={() =>
                send({
                  type: 'stateRx.object.change',
                  key: obj.id,
                  state: value,
                  timestamp: Date.now()
                })
              }
            >
              Save
            </button>
          </header>
          <div className={styles.editorWrapper}>
            <AceEditor
              className={styles.editor}
              width="100%"
              height="100%"
              showPrintMargin={false}
              mode="json"
              theme="monokai"
              value={
                typeof value !== 'string'
                  ? JSON.stringify(value, undefined, 2)
                  : value
              }
              onChange={(value) => setValue(safeParseJSON(value))}
              name="editor"
              editorProps={{ $blockScrolling: true }}
            />
          </div>
        </>
      ) : (
        <>
          <header>State</header>
          Object not found
        </>
      )}
    </div>
  );
}

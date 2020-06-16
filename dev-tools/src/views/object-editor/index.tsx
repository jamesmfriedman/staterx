import React, { useState, useEffect } from 'react';
import styles from './index.module.css';
import { objects, viewObject } from '@state';
import { bridge } from '@common/bridge';
import { useRx } from 'staterx';
import AceEditor from 'react-ace';

import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import { safeParseJSON } from '@src/common/utils';

export function ObjectEditor() {
  const selectedId = useRx(viewObject.state$);
  const obj = useRx(() => objects.byId(selectedId), [selectedId]);
  const [value, setValue] = useState('');

  const isChanged = (() => {
    const stateValue = obj?.state;
    const cleaned =
      typeof stateValue !== 'string'
        ? JSON.stringify(stateValue, undefined, 2)
        : stateValue;
    return cleaned !== value;
  })();

  const commit = () => {
    bridge.send({
      type: 'stateRx.object.change',
      key: obj?.id || '',
      state: safeParseJSON(value),
      timestamp: Date.now()
    });
  };

  const reset = () => {
    const newValue = obj?.state;
    setValue(
      typeof newValue !== 'string'
        ? JSON.stringify(newValue, undefined, 2)
        : newValue
    );
  };

  useEffect(() => {
    reset();
  }, [obj?.state, obj?.key]);

  return (
    <div className={styles.view}>
      {obj ? (
        <>
          <header>
            State: {obj.key}
            <span className={styles.spacer} />
            {isChanged && (
              <>
                <button onClick={reset}>Cancel</button>
                <button className="primary" onClick={commit}>
                  Save
                </button>
              </>
            )}
          </header>
          <div className={styles.editorWrapper}>
            <AceEditor
              className={styles.editor}
              width="100%"
              height="100%"
              showPrintMargin={false}
              tabSize={2}
              mode="javascript"
              theme="monokai"
              enableBasicAutocompletion
              enableLiveAutocompletion
              value={value}
              onChange={(value) => setValue(value)}
              name="editor"
              editorProps={{ $blockScrolling: true }}
            />
          </div>
        </>
      ) : (
        <>
          <header>State</header>
        </>
      )}
    </div>
  );
}

import React from 'react';
import styles from './index.module.css';
import classnames from 'classnames';

export function View({
  padding = true,
  className,
  ...rest
}: {
  padding?: boolean | 'horizontal' | 'vertical';
} & React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={classnames(className, styles.view, {
        [styles.paddingHorizontal]:
          padding === true || padding === 'horizontal',
        [styles.paddingVertical]: padding === true || padding === 'vertical'
      })}
      {...rest}
    />
  );
}

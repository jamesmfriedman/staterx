import React from 'react';
import styles from './index.module.css';
import classnames from 'classnames';

export type ColorT =
  | 'default'
  | 'secondary'
  | 'hint'
  | 'disabled'
  | 'onPrimary'
  | 'onSecondary'
  | 'onAccent';

export type TypographyT =
  | 'headline'
  | 'title'
  | 'subheading'
  | 'body'
  | 'caption';

export function Text({
  use,
  tag: Tag = 'div',
  className,
  children,
  inline,
  color,
  ...rest
}: {
  use?: TypographyT;
  tag?: React.ElementType;
  inline?: boolean;
  color?: ColorT;
} & React.HTMLProps<any>) {
  return (
    <Tag
      {...rest}
      className={classnames(
        className,
        styles.text,
        use && styles[use],
        inline && styles.inline,
        color && styles[color]
      )}
    >
      {children}
    </Tag>
  );
}

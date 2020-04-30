/**
 * React Router doesn't consider external links or protocols
 * when building links. Use this when you need to consider
 * links as possibly external and maintain the same interface
 */
import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

const linkFromObject = (to: LinkProps['to']): string => {
  if (typeof to === 'object') {
    let url = to.pathname || '';
    if (to.search) {
      url += `?${to.search}`;
    }
    return url;
  }
  return to as string;
};

export function LinkExternal({
  component,
  to,
  replace,
  innerRef,
  children,
  ...rest
}: LinkProps) {
  const url = linkFromObject(to);
  if (url.startsWith('http')) {
    return (
      <a {...rest} href={url}>
        {children}
      </a>
    );
  }

  return (
    <Link component={component} to={to} replace={replace} innerRef={innerRef}>
      {children}
    </Link>
  );
}

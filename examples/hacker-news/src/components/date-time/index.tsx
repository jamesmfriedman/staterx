import React from 'react';
import { formatDistanceToNow } from 'date-fns';

export function DateTime({ value }: { value: Date | number }) {
  const formatted = formatDistanceToNow(value, { addSuffix: true }).replace(
    'about ',
    ''
  );
  return <>{formatted}</>;
}

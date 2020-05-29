import React from 'react';
import { delay } from 'rxjs/operators';
import { useRx, useRxMemo } from 'staterx';
import { createValue, createItems } from 'staterx';
import { scan } from 'rxjs/operators';

export const counter = createValue(0, {
  effects: ({ state$ }) => ({
    // here we create two functions that describe how we want to change our value
    increment: () => counter.set(val => val + 1),
    decrement: () => counter.set(val => val - 1),
    // here we create an observable that can keep count of the total number of
    // times our counter has changed, regardless of direction
    callCount$: state$.pipe(scan(acc => acc + 1, -1))
  })
});

export const todos = createItems({
  '1': { id: '1', text: 'First Todo', completed: false },
  '2': { id: '2', text: 'Second Todo', completed: false },
  '3': { id: '3', text: 'Third Todo', completed: false }
} as { [id: string]: { id: string; text: string; completed: boolean } });

export const colors = createValue('red' as 'red' | 'blue');

export function ComponentA() {
  const [backgroundColor] = useRx(colors.state$);
  return (
    <div
      className="colorExample"
      style={{
        backgroundColor
      }}
    >
      A
    </div>
  );
}

export function ComponentB() {
  const [backgroundColor] = useRxMemo(() => colors.state$.pipe(delay(500)), []);
  return (
    <div
      className="colorExample"
      style={{
        backgroundColor
      }}
    >
      B
    </div>
  );
}

export function SetColors() {
  return (
    <>
      <button onClick={() => colors.set('red')}>Make it Red</button>
      <button onClick={() => colors.set('blue')}>Make it Blue</button>
    </>
  );
}

const myVal = createValue(0 as number | string);

myVal.set('foo');

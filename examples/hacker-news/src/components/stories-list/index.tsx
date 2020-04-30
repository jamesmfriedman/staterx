import React from 'react';
import { StoryT } from '@src/state';
import styles from './index.module.css';
import { View } from '@components/view';
import { Story } from './story';
import { Flipper, Flipped } from 'react-flip-toolkit';

export function StoriesList({ stories }: { stories: StoryT[] }) {
  return (
    <Flipper flipKey={JSON.stringify(stories)}>
      <View padding="vertical">
        <ol className={styles.list}>
          {stories.map((s) => (
            <Flipped key={s.id} flipId={s.id}>
              <Story story={s} />
            </Flipped>
          ))}
        </ol>
      </View>
    </Flipper>
  );
}

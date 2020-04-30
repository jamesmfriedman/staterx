import React from 'react';
import styles from './story.module.css';
import { Link } from 'react-router-dom';
import { StoryT } from '@src/state';
import { DateTime } from '@src/components/date-time';
import { Text } from '@src/components/text';
import { LinkExternal } from '@src/components/link-external';

export function Story({ story, ...rest }: { story: StoryT }) {
  return (
    <li {...rest} className={styles.story}>
      <header>
        <Text tag="h2" use="body" className={styles.title}>
          <LinkExternal to={story.url}>{story.title}</LinkExternal>
        </Text>
        {story.domain && (
          <Text use="caption" color="secondary" inline>
            <Link className={styles.domain} to={`/from?site=${story.domain}`}>
              ({story.domain})
            </Link>
          </Text>
        )}
      </header>
      <footer>
        <Text use="caption" color="secondary">
          {story.score} point{story.score !== 1 && 's'} by{' '}
          <a href={`/user?id=${story.by}`}>{story.by}</a>{' '}
          <DateTime value={story.time} /> | hide | {story.commentCount} comments
        </Text>
      </footer>
    </li>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './index.module.css';
import { View } from '@components/view';
import { FeedOptions } from '@src/state';

export function Nav() {
  return (
    <nav className={styles.nav}>
      <View className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <img
            src="https://news.ycombinator.com/y18.gif"
            alt="Y Combinator Logo"
          />

          <h1 className={styles.title}>Hacker News</h1>
        </Link>
        <Link to={`/${FeedOptions.newest}`}>New</Link>
      </View>
    </nav>
  );
}

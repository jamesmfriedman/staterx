import React from 'react';
import { useRx } from 'staterx';
import { storyState, FeedOptions } from '@state';
import { StoriesList } from '@src/components/stories-list';

export function Feed({
  section,
  domain = ''
}: {
  section: FeedOptions;
  domain?: string;
}) {
  const stories =
    useRx(() => storyState.onViewFeed({ section, domain }), [
      section,
      domain
    ]) || [];

  return <StoriesList stories={stories} />;
}

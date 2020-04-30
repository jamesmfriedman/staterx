import React, { useEffect } from 'react';
import { useRxMemo } from 'staterx';
import { storyState, FeedOptions } from '@state';
import { StoriesList } from '@src/components/stories-list';

export function Feed({
  section,
  domain = ''
}: {
  section: FeedOptions;
  domain?: string;
}) {
  const [stories] = useRxMemo(
    () => {
      switch (section) {
        case FeedOptions.from:
          return storyState.byDomain(domain);
        case FeedOptions.topstories:
        default:
          return storyState.sorted$;
      }
    },
    [section, domain],
    []
  );

  useEffect(() => {
    const subscription = storyState.onViewFeed({ section, domain });
    return () => {
      subscription.unsubscribe();
    };
  }, [section, domain]);

  return <StoriesList stories={stories} />;
}

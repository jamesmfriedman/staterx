import { zip, from } from 'rxjs';
import { map, mergeMap, finalize } from 'rxjs/operators';
import { object, list } from 'rxfire/database';
import { createBranch } from 'staterx';
import { db } from '@state/firebase';
import { rawDomain } from '@src/common/raw-domain';

/**************************************************
 * Definitions
 **************************************************/
export type StoryT = {
  by: string;
  commentCount: number;
  id: number;
  kids: number[];
  score: number;
  text: string;
  time: number;
  title: string;
  type: 'story';
  url: string;
  order: number;
  domain: string;
};

export type StoryStateT = {
  items: { [id: string]: StoryT | undefined };
};

export enum FeedOptions {
  topstories = 'topstories',
  beststories = 'beststories',
  newstories = 'newstories',
  from = 'from',
  front = 'front',
  askstories = 'askstories',
  showstories = 'showstories',
  jobstories = 'jobstories'
}

/**************************************************
 * Utils
 **************************************************/
const branch = createBranch<StoryT, StoryStateT>(undefined, {
  name: 'story',
  defaultItem: {
    by: '',
    kids: [],
    score: 0,
    text: '',
    time: 0,
    title: '',
    type: 'story'
  }
});

/** Get all items sorted properly for the feed */
const sorted$ = branch.all$.pipe((items) =>
  items.pipe(map((items) => [...items].sort((a, b) => a.order - b.order)))
);

/** Get all items for a specific domain */
const byDomain = (domain: string) =>
  sorted$.pipe(map((stories) => stories.filter((s) => s.domain === domain)));

/** Add a story */
const addStory = (story: Partial<StoryT>) => branch.create(story);

/**
 * Creates a stream of stories directly from Firebase that will live update
 * whenever anything changes.
 */
const getStoriesFromFirebase = (section: FeedOptions) => {
  return list(db.child(section).limitToFirst(30)).pipe(
    map((query) => query.map((q) => q.snapshot.val())),
    mergeMap((ids) => zip(...ids.map((id) => object(db.child(`item/${id}`))))),
    map((queries) =>
      queries
        .map((q) => q.snapshot.val())
        // filter out null responses
        .filter(Boolean)
        .map((s, order) => {
          // make time js friendly, convert from seconds to ms
          s.time = s.time * 1000;
          // grab the raw domain if there is a url
          s.domain = s.url ? rawDomain(s.url) : '';
          // if there was no url, it is a local post
          s.url = s.url || `/item?id=${s.id}`;
          // store the comment count
          s.commentCount = s.descendants;
          s.order = order;
          return s as StoryT;
        })
    )
  );
};

/**
 * The firebase api didn't include the ability to get stories from a specific domain
 * So this is mixing in some data from Algolia's public hacker news api.
 */
const getStoriesFromAlgolia = (domain: string) => {
  return from(
    fetch(
      `https://hn.algolia.com/api/v1/search?query=${domain}&restrictSearchableAttributes=url`
    )
      .then((res) => res.json())
      .then((val) => val.hits as any[])
  ).pipe(
    map((results) =>
      results.map((s: any, order: number) => {
        const story: StoryT = {
          id: Number(s.objectID),
          by: s.author,
          kids: [],
          score: s.points,
          text: s.story_text || '',
          time: s.created_at_i * 1000,
          title: s.title,
          type: 'story',
          url: s.url,
          domain: rawDomain(s.url),
          commentCount: s.num_comments,
          order
        };
        return story;
      })
    )
  );
};

/**
 * Create a producer / consumer set of observables that will
 * stream stories directly to the output
 */
const onViewFeed = ({
  section,
  domain = ''
}: {
  section: FeedOptions;
  domain?: string;
}) => {
  let producer$;
  let consumer$;

  switch (section) {
    case FeedOptions.from:
      producer$ = getStoriesFromAlgolia(domain);
      consumer$ = byDomain(domain);
      break;
    default:
      producer$ = getStoriesFromFirebase(section);
      consumer$ = sorted$;
      break;
  }

  // Subscribe to our state
  const creatorSub = producer$
    .pipe(
      map((story, index) => {
        // Empty our previous stories when we switch sections
        if (index === 0) storyState.reset();
        return story;
      })
    )
    .subscribe((stories) => storyState.update(stories));

  return consumer$.pipe(finalize(() => creatorSub.unsubscribe()));
};

export const storyState = {
  ...branch,
  sorted$,
  byDomain,
  addStory,
  onViewFeed
};

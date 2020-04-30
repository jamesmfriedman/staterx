import { zip, from } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
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
  news = 'news',
  newest = 'newest',
  from = 'from',
  front = 'front',
  ask = 'ask',
  show = 'show'
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

const sorted$ = branch.all$.pipe((items) =>
  items.pipe(map((items) => [...items].sort((a, b) => a.order - b.order)))
);

const byDomain = (domain: string) =>
  sorted$.pipe(map((stories) => stories.filter((s) => s.domain === domain)));

const addStory = (story: Partial<StoryT>) => branch.create(story);

const getStoriesFromFirebase = (section: FeedOptions) => {
  let child = '';

  switch (section) {
    case FeedOptions.newest:
      child = 'newstories';
      break;
    case FeedOptions.topstories:
    case FeedOptions.news:
    default:
      child = 'topstories';
      break;
  }

  return list(db.child(child).limitToFirst(30)).pipe(
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

const onViewFeed = ({
  section,
  domain = ''
}: {
  section: FeedOptions;
  domain?: string;
}) => {
  let observable$;
  switch (section) {
    case FeedOptions.from:
      observable$ = getStoriesFromAlgolia(domain);
      break;
    case FeedOptions.topstories:
    case FeedOptions.news:
    case FeedOptions.newest:
    default:
      observable$ = getStoriesFromFirebase(section);
      break;
  }

  // Reset our current state when we get our first response
  observable$.pipe(take(1)).subscribe(() => storyState.reset());

  // Subscribe to our state
  return observable$.subscribe((stories) => storyState.update(stories));
};

export const storyState = {
  ...branch,
  sorted$,
  byDomain,
  addStory,
  onViewFeed
};

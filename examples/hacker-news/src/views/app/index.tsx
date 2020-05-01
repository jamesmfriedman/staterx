import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Feed } from '@views/feed';
import { Nav } from '@src/components/nav';
import { FeedOptions } from '@src/state';
import { getQueryParam } from '@src/common/history';

const feedPaths = [
  FeedOptions.topstories,
  FeedOptions.newstories,
  FeedOptions.beststories,
  FeedOptions.askstories,
  FeedOptions.showstories,
  FeedOptions.jobstories
].join('|');

function App() {
  return (
    <>
      <Nav />
      <Switch>
        <Route
          path={`/:path(${feedPaths})?`}
          exact
          render={({ match }) => (
            <Feed section={match.params.path || FeedOptions.topstories} />
          )}
        />

        <Route
          path="/from"
          exact
          render={() => (
            <Feed section={FeedOptions.from} domain={getQueryParam('site')} />
          )}
        />

        <Route path="/new" extact render={() => <>New</>} />
      </Switch>
    </>
  );
}

export default App;

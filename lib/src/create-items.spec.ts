import { createItems } from './create-items';

describe('createItems', () => {
  const items: { [id: string]: { id: string; text: string } } = {
    '1': { id: '1', text: 'test' },
    '2': { id: '2', text: 'test' }
  };

  it('with options', () => {
    const state = createItems({
      key: 'test',
      default: items,
      autoRun: true,
      effects: () => {},
      reducer: (state) => state,
      generateId: () => String(Math.random()),
      defaultItem: { text: 'test' }
    });

    expect(state.key).toBe('test');
  });

  it('get', () => {
    const state = createItems({ default: items });
    expect(state.get()).toEqual(items);
  });

  it('set', () => {
    const state = createItems({ default: items });
    state.set({});
    expect(state.get()).toEqual({});
  });

  it('reset', () => {
    const state = createItems({ default: items });
    state.set({});
    state.reset();
    expect(state.get()).toEqual(items);
  });

  it('state$', (done) => {
    const state = createItems({ default: items });

    state.state$.subscribe((val) => {
      expect(val).toEqual(items);
      done();
    });
  });

  it('action$', (done) => {
    const state = createItems({ default: items });

    state.action$.subscribe((val) => {
      expect(val).toEqual({ type: `${state.key}/SET`, data: {} });
      done();
    });

    state.set({});
  });

  it('dispatch', (done) => {
    const state = createItems({ default: items });

    state.action$.subscribe((val) => {
      expect(val).toEqual({ type: 'test' });
      done();
    });

    state.dispatch({ type: 'test' });
  });

  it('create', () => {
    const state = createItems();
    const state2 = createItems({
      defaultItem: () => ({})
    });

    // with item
    state.create({ text: 'test' });
    // without object
    state.create();
    // test defaultItem as function
    state2.create();
    expect(Object.values(state.get())[0]?.text).toEqual('test');
  });

  it('update', () => {
    const state = createItems({
      default: { test: { id: 'test', text: 'one' } }
    });
    state.update({ id: 'test', text: 'two' });
    expect(state.get()).toEqual({ test: { id: 'test', text: 'two' } });
  });

  it('replace', () => {
    const state = createItems({
      default: { test: { id: 'test', text: 'one' } }
    });
    state.replace({ id: 'test', text: 'two' });
    expect(state.get()).toEqual({ test: { id: 'test', text: 'two' } });
  });

  it('remove', () => {
    const state = createItems({ default: items });
    state.remove('1');
    expect(state.get()).toEqual({ '2': { id: '2', text: 'test' } });
    state.remove(['1', '2']);
  });

  it('all$', (done) => {
    const state = createItems({ default: items });
    state.all$.subscribe((val) => {
      expect(val).toEqual(Object.values(items));
      done();
    });
  });

  it('byId', (done) => {
    const state = createItems({ default: items });
    state.byId('1').subscribe((val) => {
      expect(val).toEqual(items['1']);
      done();
    });
  });

  it('byIds', (done) => {
    const state = createItems({ default: items });
    state.byIds(['1', '2']).subscribe((val) => {
      expect(val).toEqual(items);
      done();
    });
  });

  it('mapByKey', (done) => {
    const state = createItems({ default: items });
    state.mapByKey('text').subscribe((val) => {
      expect(val).toEqual({
        test: [
          { id: '1', text: 'test' },
          { id: '2', text: 'test' }
        ]
      });
      done();
    });
  });
});

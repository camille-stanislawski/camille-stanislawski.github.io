import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reducer, initialState } from './reducer.js';
import { cvLoaded, routeChanged } from './actions.js';
import { createStore } from './store.js';

test('reducer stores the loaded CV without mutating state', () => {
  const cv = { name: 'X', sections: [] };
  const next = reducer(initialState, cvLoaded(cv));
  assert.equal(next.cv, cv);
  assert.equal(initialState.cv, null);
});

test('reducer stores the current route', () => {
  const route = { name: 'cv', params: { section: 'profil' } };
  assert.deepEqual(reducer(initialState, routeChanged(route)).route, route);
});

test('reducer ignores unknown actions', () => {
  assert.equal(reducer(initialState, { type: 'unknown' }), initialState);
});

test('store notifies subscribers until they unsubscribe', () => {
  const store = createStore(reducer, initialState);
  let calls = 0;
  const unsubscribe = store.subscribe(() => calls++);
  store.dispatch(cvLoaded({}));
  unsubscribe();
  store.dispatch(cvLoaded({}));
  assert.equal(calls, 1);
});

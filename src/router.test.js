import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matchRoute, routes } from './router.js';

const ids = ['profil', 'formation'];

test('empty and root paths show the full CV', () => {
  assert.deepEqual(matchRoute('', ids), { name: 'cv', params: {} });
  assert.deepEqual(matchRoute('/', ids), { name: 'cv', params: {} });
});

test('known section paths show the CV at that section', () => {
  assert.deepEqual(matchRoute('/formation', ids), { name: 'cv', params: { section: 'formation' } });
});

test('unknown paths are not found', () => {
  assert.equal(matchRoute('/inconnu', ids).name, 'notFound');
});

test('titles include the section label', () => {
  const cv = { name: 'Jane DOE', sections: [{ id: 'profil', label: 'Profil' }] };
  assert.equal(routes.cv.title({}, cv), 'CV Jane DOE');
  assert.equal(routes.cv.title({ section: 'profil' }, cv), 'Profil | CV Jane DOE');
});

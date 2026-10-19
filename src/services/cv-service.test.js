import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contactHref, createCvService } from './cv-service.js';

test('contactHref links emails and phone numbers only', () => {
  assert.equal(contactHref('camille.stanis@hotmail.com'), 'mailto:camille.stanis@hotmail.com');
  assert.equal(contactHref('06 67 57 71 71'), 'tel:0667577171');
  assert.equal(contactHref('Cugnaux (31) - mobilité Toulouse'), null);
});

test('load parses the Markdown returned by the repository', async () => {
  const service = createCvService({ fetchMarkdown: async () => '# Jane DOE\n\n## PROFIL\n\nTexte.' });
  const cv = await service.load();
  assert.equal(cv.name, 'Jane DOE');
  assert.equal(cv.sections[0].id, 'profil');
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseCv, parseInline, slugify } from './cv-parser.js';

const markdown = await readFile(new URL('../../cv/cv-base.md', import.meta.url), 'utf8');
const cv = parseCv(markdown);

const inlineText = (inlines) => inlines.map((i) => i.text).join('');
const blockLines = (blocks) =>
  blocks.flatMap((b) => (b.type === 'list' ? b.items.map(inlineText) : [inlineText(b.inlines)]));

test('parseInline splits bold and italic runs', () => {
  assert.deepEqual(parseInline('**Paie :** interface *SILAE* ok'), [
    { text: 'Paie :', strong: true },
    { text: ' interface ' },
    { text: 'SILAE', em: true },
    { text: ' ok' },
  ]);
});

test('slugify strips accents and punctuation', () => {
  assert.equal(slugify("CENTRES D'INTÉRÊT"), 'centres-d-interet');
});

test('header: name, headline and one contact line per Markdown line', () => {
  assert.equal(cv.name, 'Camille STANISLAWSKI');
  assert.match(cv.headline, /^Responsable Administrative et Financière \(RAF\)/);
  assert.deepEqual(cv.contactLines, [
    ['Cugnaux (31) - mobilité Toulouse', '06 67 57 71 71', 'camille.stanis@hotmail.com'],
    ['Disponible immédiatement', 'Permis B, véhiculée'],
  ]);
});

test('header: photo comes from the <img> tag, the HTML wrapper is ignored', () => {
  assert.deepEqual(cv.photo, { src: 'photo-camille.jpg', alt: 'Photo de Camille Stanislawski' });
  assert.deepEqual(parseCv('# Nom').photo, null);
});

test('sections keep Markdown order with sentence-case labels', () => {
  assert.deepEqual(cv.sections.map((s) => s.label), [
    'Profil', 'Compétences clés', 'Expériences professionnelles', 'Formation', 'Langues', "Centres d'intérêt",
  ]);
});

test('job entries split role, company and meta', () => {
  const jobs = cv.sections.find((s) => s.id === 'experiences-professionnelles').entries;
  assert.equal(jobs.length, 4);
  assert.equal(jobs[0].title, 'Responsable Administrative et Financière');
  assert.equal(jobs[0].org, 'B-HIVE Group');
  assert.deepEqual(jobs[0].meta, ['Janvier 2024 - Février 2026', "Conseil en ingénierie, environ 750 salariés, 45 M€ de chiffre d'affaires"]);
  assert.equal(jobs[0].blocks[0].items.length, 8);
  assert.deepEqual(jobs[3].meta, ['2013 - 2015']);
  assert.deepEqual(jobs[3].blocks, []);
});

test('list items keep their bold label', () => {
  const skills = cv.sections.find((s) => s.id === 'competences-cles');
  assert.deepEqual(skills.blocks[0].items[0][0], { text: 'Contrôle de gestion :', strong: true });
});

test('every line of the Markdown is rendered, nothing added or dropped', () => {
  const expected = markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && line !== '---' && !line.startsWith('<'))
    .map((line) => line.replace(/^#{1,3} |^- /, '').replaceAll('*', ''));

  const actual = [
    cv.name,
    cv.headline,
    ...cv.contactLines.map((line) => line.join(' | ')),
    ...cv.sections.flatMap((section) => [
      section.title,
      ...blockLines(section.blocks),
      ...section.entries.flatMap((entry) => [
        [entry.title, entry.org].filter(Boolean).join(' | '),
        ...(entry.meta.length ? [entry.meta.join(' | ')] : []),
        ...blockLines(entry.blocks),
      ]),
    ]),
  ];

  assert.deepEqual(actual, expected);
});

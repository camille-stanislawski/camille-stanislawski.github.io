import { parseCv } from './cv-parser.js';

export function contactHref(text) {
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return `mailto:${text}`;
  if (/^\+?[\d\s.]{10,}$/.test(text)) return `tel:${text.replace(/[\s.]/g, '')}`;
  return null;
}

export function createCvService(repository) {
  return {
    async load() {
      return parseCv(await repository.fetchMarkdown());
    },
    contactHref,
  };
}

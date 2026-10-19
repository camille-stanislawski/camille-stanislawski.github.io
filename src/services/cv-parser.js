// Parses the Markdown subset used by cv/cv-base.md: #, ##, ### headings,
// "- " lists, **bold**, *italic*, "---" rules and one item per line. HTML lines
// (the photo table around the header) are skipped, except the <img> of the photo.

export function parseInline(text) {
  const inlines = [];
  const pattern = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let last = 0;
  let match;
  while ((match = pattern.exec(text))) {
    if (match.index > last) inlines.push({ text: text.slice(last, match.index) });
    inlines.push(match[1] !== undefined ? { text: match[1], strong: true } : { text: match[2], em: true });
    last = pattern.lastIndex;
  }
  if (last < text.length) inlines.push({ text: text.slice(last) });
  return inlines;
}

export function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function sentenceCase(text) {
  return text.charAt(0) + text.slice(1).toLocaleLowerCase('fr');
}

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`, 'i'))?.[1] ?? '';
}

export function parseCv(markdown) {
  const cv = { name: '', headline: '', photo: null, contactLines: [], sections: [] };
  let section = null;
  let entry = null;
  let list = null;

  for (const raw of markdown.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line === '---') {
      list = null;
      continue;
    }
    if (line.startsWith('<')) {
      const img = line.match(/<img\b[^>]*>/i)?.[0];
      if (img) cv.photo = { src: attribute(img, 'src'), alt: attribute(img, 'alt') };
      continue;
    }
    if (line.startsWith('# ')) {
      cv.name = line.slice(2);
      continue;
    }
    if (line.startsWith('## ')) {
      const title = line.slice(3);
      section = { id: slugify(title), title, label: sentenceCase(title), blocks: [], entries: [] };
      cv.sections.push(section);
      entry = list = null;
      continue;
    }
    if (line.startsWith('### ')) {
      const [title, ...org] = line.slice(4).split(' | ');
      entry = { title, org: org.join(' | '), meta: [], blocks: [] };
      section.entries.push(entry);
      list = null;
      continue;
    }
    if (!section) {
      const bold = line.match(/^\*\*(.+)\*\*$/);
      if (bold) cv.headline = bold[1];
      else cv.contactLines.push(line.split(' | '));
      continue;
    }

    const blocks = entry ? entry.blocks : section.blocks;
    if (line.startsWith('- ')) {
      if (!list) blocks.push((list = { type: 'list', items: [] }));
      list.items.push(parseInline(line.slice(2)));
      continue;
    }
    list = null;

    const italic = line.match(/^\*([^*].*)\*$/);
    if (italic && entry && entry.meta.length === 0 && entry.blocks.length === 0) {
      entry.meta = italic[1].split(' | ');
      continue;
    }
    blocks.push({ type: 'paragraph', inlines: parseInline(line) });
  }

  return cv;
}

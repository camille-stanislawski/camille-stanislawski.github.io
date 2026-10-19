import { BaseElement } from '../base/base-element.js';
import { h } from '../base/dom.js';

function inlineNodes(inlines) {
  return inlines.map(({ text, strong, em }) => {
    if (strong) return h('strong', {}, text);
    if (em) return h('em', {}, text);
    return text;
  });
}

function blockNode(block) {
  if (block.type === 'list') {
    return h('ul', { role: 'list' }, ...block.items.map((item) => h('li', {}, ...inlineNodes(item))));
  }
  return h('p', {}, ...inlineNodes(block.inlines));
}

function entryNode(entry) {
  const [dates, ...context] = entry.meta;
  const title = h('h3', {}, h('span', { className: 'role' }, entry.title));
  if (entry.org) title.append(' ', h('span', { className: 'org' }, entry.org));

  const body = h('div', { className: 'entry-body' }, title);
  if (context.length) body.append(h('p', { className: 'context' }, context.join(' | ')));
  body.append(...entry.blocks.map(blockNode));

  if (!entry.meta.length) return h('article', { className: 'entry' }, body);
  // Each date stays on one line; only the range separator may wrap.
  const dateParts = dates.split(' - ').flatMap((part, i) => [i ? ' - ' : '', h('span', {}, part)]);
  return h('article', { className: 'entry entry--dated' }, h('p', { className: 'dates' }, ...dateParts), body);
}

class CvSection extends BaseElement {
  static styles = [new URL('./cv-section.css', import.meta.url).href];

  render() {
    const id = this.getAttribute('section-id');
    const section = this.store.getState().cv?.sections.find((s) => s.id === id);
    if (this.heading || !section) return;
    const dated = section.entries.some((entry) => entry.meta.length);
    this.heading = h('h2', { id: 'title', tabindex: '-1' }, section.label);
    this.root.append(h('section', { 'aria-labelledby': 'title' },
      this.heading,
      ...section.blocks.map(blockNode),
      ...(section.entries.length
        ? [h('div', { className: dated ? 'entries entries--timeline' : 'entries entries--grid' },
            ...section.entries.map(entryNode))]
        : [])));
  }

  focusHeading() {
    this.heading?.focus({ preventScroll: true });
    this.scrollIntoView();
  }
}

customElements.define('cv-section', CvSection);

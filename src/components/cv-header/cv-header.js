import { BaseElement } from '../base/base-element.js';
import { h } from '../base/dom.js';
import { config } from '../../config.js';

class CvHeader extends BaseElement {
  static styles = [new URL('./cv-header.css', import.meta.url).href];

  render() {
    const { cv } = this.store.getState();
    if (this.heading || !cv) return;
    const [contact = [], ...otherLines] = cv.contactLines;
    this.heading = h('h1', { tabindex: '-1' }, cv.name);
    this.root.append(h('header', {},
      this.#photoNode(cv.photo),
      h('div', {},
        this.heading,
        h('p', { className: 'headline' }, cv.headline),
        h('ul', { className: 'contact' }, ...contact.map((item) => h('li', {}, this.#contactNode(item)))),
        ...otherLines.map((line) => h('ul', { className: 'tags' }, ...line.map((item) => h('li', {}, item)))))));
  }

  // The photo path in the Markdown is relative to the CV file; a missing file is simply not shown.
  #photoNode(photo) {
    if (!photo) return '';
    const src = new URL(photo.src, new URL(config.cvUrl, document.baseURI)).href;
    const img = h('img', { className: 'photo', src, alt: photo.alt });
    img.addEventListener('error', () => img.remove());
    return img;
  }

  #contactNode(text) {
    const href = this.services.cv.contactHref(text);
    return href ? h('a', { href }, text) : text;
  }

  focusHeading() {
    this.heading?.focus({ preventScroll: true });
  }
}

customElements.define('cv-header', CvHeader);

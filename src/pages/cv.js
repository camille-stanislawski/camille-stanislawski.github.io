import { BaseElement } from '../components/base/base-element.js';
import { h } from '../components/base/dom.js';
import '../components/cv-header/cv-header.js';
import '../components/cv-section/cv-section.js';

class CvPage extends BaseElement {
  static styles = [new URL('./cv.css', import.meta.url).href];

  render() {
    const { cv } = this.store.getState();
    if (this.header || !cv) return;
    this.header = this.#child('cv-header');
    this.sections = cv.sections.map((section) => this.#child('cv-section', { 'section-id': section.id }));
    this.root.append(h('article', { className: 'sheet' }, this.header, ...this.sections));
  }

  #child(tag, attrs) {
    const node = h(tag, attrs);
    node.store = this.store;
    node.services = this.services;
    return node;
  }

  async focusHeading() {
    await Promise.all([this, this.header, ...this.sections].map((node) => node.stylesReady));
    const id = this.getAttribute('section');
    const section = this.sections?.find((node) => node.getAttribute('section-id') === id);
    if (section) {
      section.focusHeading();
    } else {
      this.header?.focusHeading();
      window.scrollTo(0, 0);
    }
  }
}

customElements.define('cv-page', CvPage);

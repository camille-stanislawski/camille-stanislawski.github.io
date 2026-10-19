import { BaseElement } from '../components/base/base-element.js';
import { h } from '../components/base/dom.js';

class NotFoundPage extends BaseElement {
  static styles = [new URL('./not-found.css', import.meta.url).href];

  render() {
    if (this.heading) return;
    this.heading = h('h1', { tabindex: '-1' }, 'Page introuvable');
    this.root.append(h('div', { className: 'box' },
      this.heading,
      h('p', {}, 'Cette section du CV n’existe pas.'),
      h('a', { href: '#/' }, 'Revenir au CV')));
  }

  focusHeading() {
    this.heading?.focus();
  }
}

customElements.define('not-found-page', NotFoundPage);

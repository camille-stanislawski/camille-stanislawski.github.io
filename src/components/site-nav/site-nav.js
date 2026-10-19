import { config } from '../../config.js';
import { BaseElement } from '../base/base-element.js';
import { h } from '../base/dom.js';

const DOWNLOAD_ICON = '<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>';

class SiteNav extends BaseElement {
  static styles = [new URL('./site-nav.css', import.meta.url).href];

  render() {
    const { cv, route } = this.store.getState();
    if (!cv) return;
    this.links ??= this.#build(cv);
    for (const link of this.links) {
      if (link.dataset.section === route.params.section) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }

  #build(cv) {
    const links = cv.sections.map((section) =>
      h('a', { href: `#/${section.id}`, 'data-section': section.id }, section.label));
    const download = h('a', { className: 'download', href: config.pdfUrl, download: config.pdfFileName },
      'Télécharger le CV (PDF)');
    download.insertAdjacentHTML('afterbegin', DOWNLOAD_ICON);

    this.root.append(h('header', { className: 'bar' },
      h('a', { className: 'brand', href: '#/' }, cv.name),
      h('nav', { 'aria-label': 'Sections du CV' },
        h('ul', {}, ...links.map((link) => h('li', {}, link)))),
      download));
    return links;
  }
}

customElements.define('site-nav', SiteNav);

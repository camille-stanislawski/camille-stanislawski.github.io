const sharedStyles = new URL('./shared.css', import.meta.url).href;

// Renders once connected with both `store` and `services` set, in any order.
// Subclasses list their stylesheet URLs in `static styles`.
export class BaseElement extends HTMLElement {
  #store;
  #services;
  #unsubscribe;

  get store() { return this.#store; }
  set store(value) { this.#store = value; this.#start(); }
  get services() { return this.#services; }
  set services(value) { this.#services = value; this.#start(); }

  connectedCallback() { this.#start(); }
  disconnectedCallback() { this.#unsubscribe?.(); this.#unsubscribe = null; }

  #start() {
    if (!this.isConnected || !this.#store || !this.#services || this.#unsubscribe) return;
    if (!this.root) {
      this.root = this.attachShadow({ mode: 'open' });
      // Resolves once this component's styles apply, so callers can measure layout.
      this.stylesReady = Promise.all([sharedStyles, ...(this.constructor.styles ?? [])].map((href) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        this.root.append(link);
        return new Promise((done) => {
          link.addEventListener('load', done, { once: true });
          link.addEventListener('error', done, { once: true });
        });
      }));
    }
    this.render();
    this.#unsubscribe = this.#store.subscribe(() => this.render());
  }
}

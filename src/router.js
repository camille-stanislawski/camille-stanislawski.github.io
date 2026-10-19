import { routeChanged } from './store/actions.js';

export const routes = {
  cv: {
    tag: 'cv-page',
    load: () => import('./pages/cv.js'),
    title: ({ section }, cv) => {
      const label = cv.sections.find((s) => s.id === section)?.label;
      return label ? `${label} | CV ${cv.name}` : `CV ${cv.name}`;
    },
  },
  notFound: {
    tag: 'not-found-page',
    load: () => import('./pages/not-found.js'),
    title: () => 'Page introuvable',
  },
};

export function matchRoute(path, sectionIds) {
  if (path === '' || path === '/') return { name: 'cv', params: {} };
  const id = path.replace(/^\//, '');
  if (sectionIds.includes(id)) return { name: 'cv', params: { section: id } };
  return { name: 'notFound', params: {} };
}

export function startRouter({ outlet, store, services }) {
  async function navigate() {
    const { cv } = store.getState();
    const match = matchRoute(location.hash.slice(1), cv.sections.map((s) => s.id));
    const route = routes[match.name];
    await route.load();

    let page = outlet.firstElementChild;
    if (page?.localName !== route.tag) {
      page = document.createElement(route.tag);
      page.store = store;
      page.services = services;
      outlet.replaceChildren(page);
    }
    if (match.params.section) page.setAttribute('section', match.params.section);
    else page.removeAttribute('section');

    store.dispatch(routeChanged(match));
    document.title = route.title(match.params, cv);
    await page.focusHeading();
  }

  window.addEventListener('hashchange', navigate);
  return navigate();
}

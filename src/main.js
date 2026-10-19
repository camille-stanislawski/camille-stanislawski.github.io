import { logger } from './config.js';
import { createStore } from './store/store.js';
import { reducer, initialState } from './store/reducer.js';
import { cvLoaded } from './store/actions.js';
import { cvRepository } from './api/cv-repository.js';
import { createCvService } from './services/cv-service.js';
import { startRouter } from './router.js';
import './components/site-nav/site-nav.js';

const services = { cv: createCvService(cvRepository) };
const store = createStore(reducer, initialState);
const outlet = document.querySelector('#outlet');

const nav = document.querySelector('site-nav');
nav.services = services;
nav.store = store;

try {
  store.dispatch(cvLoaded(await services.cv.load()));
  await startRouter({ outlet, store, services });
} catch (error) {
  logger.error(error);
  outlet.textContent = 'Le CV n’a pas pu être chargé. Veuillez recharger la page.';
}

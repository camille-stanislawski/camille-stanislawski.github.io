import { CV_LOADED, ROUTE_CHANGED } from './actions.js';

export const initialState = {
  cv: null,
  route: { name: 'cv', params: {} },
};

export function reducer(state, action) {
  switch (action.type) {
    case CV_LOADED:
      return { ...state, cv: action.cv };
    case ROUTE_CHANGED:
      return { ...state, route: action.route };
    default:
      return state;
  }
}

export const CV_LOADED = 'cv/loaded';
export const ROUTE_CHANGED = 'route/changed';

export const cvLoaded = (cv) => ({ type: CV_LOADED, cv });
export const routeChanged = (route) => ({ type: ROUTE_CHANGED, route });

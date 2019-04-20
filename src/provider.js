import ModelPoint from './model-point.js';
import ModelDestination from './model-destination.js';
import ModelOffer from './model-offer.js';

const objectToArray = (object) => {
  return Object.keys(object).map((id) => object[id]);
};

export default class Provider {
  constructor({api, store, generateId}) {
    this._api = api;
    this._store = store;
    this._generateId = generateId;
    this._needSync = false;
  }

  updatePoint({id, data}) {
    if (this._isOnline()) {
      return this._api.updatePoint({id, data})
        .then((point) => {
          this._store.setItem({key: point.id, item: point.toRAW(), storeKey: `points`});
          return point;
        });
    }
    const point = data;
    this._needSync = true;
    this._store.setItem({key: point.id, item: point, storeKey: `points`});
    return Promise.resolve(ModelPoint.parsePoint(point));
  }

  createPoint({point}) {
    if (this._isOnline()) {
      return this._api.createPoint({point})
        .then((pointCreated) => {
          this._store.setItem({key: pointCreated.id, item: pointCreated.toRAW(), storeKey: `points`});
          return pointCreated;
        });
    }
    point.id = this._generateId();
    this._needSync = true;

    this._store.setItem({key: point.id, item: point, storeKey: `points`});
    return Promise.resolve(ModelPoint.parsePoint(point));
  }

  deletePoint({id}) {
    if (this._isOnline()) {
      return this._api.deletePoint({id})
        .then(() => {
          this._store.removeItem({key: id, storeKey: `points`});
        });
    }
    this._needSync = true;
    this._store.removeItem({key: id, storeKey: `points`});
    return Promise.resolve(true);
  }

  getPoints() {
    if (this._isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const pointsNew = {};
          points.forEach((it) => {
            if (it.id) {
              pointsNew[it.id] = it;
            }
          });
          this._store.setItems({items: pointsNew, storeKey: `points`});
          return ModelPoint.parsePoints(points);
        });
    }
    const rawPointsMap = this._store.getAll({storeKey: `points`});
    const rawPoints = objectToArray(rawPointsMap);
    const points = ModelPoint.parsePoints(rawPoints);

    return Promise.resolve(points);
  }

  getDestinations() {
    if (this._isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          const destinationsNew = {};

          destinations.forEach((it)=> {
            if (it.name) {
              destinationsNew[it.name] = it;
            }
          });

          this._store.setItems({items: destinationsNew, storeKey: `destinations`});
          return ModelDestination.parseDestinations(destinations);
        });
    }
    const rawDestinationsMap = this._store.getAll({storeKey: `destinations`});
    const rawDestinations = objectToArray(rawDestinationsMap);
    const destinations = ModelDestination.parseDestinations(rawDestinations);

    return Promise.resolve(destinations);
  }

  getOffers() {
    if (this._isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          const offersNew = {};

          offers.forEach((it)=> {
            if (it.type) {
              offersNew[it.type] = it;
            }
          });

          this._store.setItems({items: offersNew, storeKey: `offers`});
          return ModelOffer.parseOffers(offers);
        });
    }
    const rawOffersMap = this._store.getAll({storeKey: `offers`});
    const rawOffers = objectToArray(rawOffersMap);
    const offers = ModelOffer.parseOffers(rawOffers);

    return Promise.resolve(offers);
  }

  syncPoints() {
    return this._api.syncPoints({points: objectToArray(this._store.getAll({storeKey: `points`}))});
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}

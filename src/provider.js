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
    } else {
      const point = data;
      this._needSync = true;
      this._store.setItem({key: point.id, item: point, storeKey: `points`});
      return Promise.resolve(ModelPoint.parsePoint(point));
    }
  }

  createPoint({point}) {
    if (this._isOnline()) {
      return this._api.createPoint({point})
        .then((pointCreated) => {
          this._store.setItem({key: pointCreated.id, item: pointCreated.toRAW(), storeKey: `points`});
          return pointCreated;
        });
    } else {
      point.id = this._generateId();
      this._needSync = true;

      this._store.setItem({key: point.id, item: point, storeKey: `points`});
      return Promise.resolve(ModelPoint.parsePoint(point));
    }
  }

  deletePoint({id}) {
    if (this._isOnline()) {
      return this._api.deletePoint({id})
        .then(() => {
          this._store.removeItem({key: id});
        });
    } else {
      this._needSync = true;
      this._store.removeItem({key: id});
      return Promise.resolve(true);
    }
  }

  getPoints() {
    if (this._isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          points.map((it) => this._store.setItem({key: it.id, item: it, storeKey: `points`}));
          return ModelPoint.parsePoints(points);
        });
    } else {
      const rawPointsMap = this._store.getAll({storeKey: `points`});
      const rawPoints = objectToArray(rawPointsMap);
      const points = ModelPoint.parsePoints(rawPoints);

      return Promise.resolve(points);
    }
  }

  getDestinations() {
    if (this._isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          destinations.map((it) => this._store.setItem({key: it.name, item: it, storeKey: `destinations`}));
          return ModelDestination.parseDestinations(destinations);
        });
    } else {
      const rawDestinationsMap = this._store.getAll({storeKey: `destinations`});
      const rawDestinations = objectToArray(rawDestinationsMap);
      const destinations = ModelDestination.parseDestinations(rawDestinations);

      return Promise.resolve(destinations);
    }
  }

  getOffers() {
    if (this._isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          offers.map((it) => this._store.setItem({key: it.type, item: it, storeKey: `offers`}));
          return ModelOffer.parseOffers(offers);
        });
    } else {
      const rawOffersMap = this._store.getAll({storeKey: `offers`});
      const rawOffers = objectToArray(rawOffersMap);
      const offers = ModelOffer.parseOffers(rawOffers);

      return Promise.resolve(offers);
    }
  }

  syncPoints() {
    return this._api.syncPoints({points: objectToArray(this._store.getAll({storeKey: `points`}))});
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}

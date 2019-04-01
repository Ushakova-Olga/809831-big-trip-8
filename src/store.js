export default class Store {
  constructor({key, storage}) {
    this._storage = storage;
    this._storeKey = key;
  }

  setItem({key, item, storeKey}) {
    let items = {};
    if (this.getAll({storeKey: [storeKey]}) !== null) {
      items = this.getAll({storeKey: [storeKey]});
    }

    items[key] = item;
    this._storage.setItem(this._storeKey[storeKey], JSON.stringify(items));
  }

  setItems({items, storeKey}) {
    this._storage.setItem(this._storeKey[storeKey], JSON.stringify(items));
  }

  getItem({key, storeKey}) {
    const items = this.getAll({storeKey: [storeKey]});
    return items[key];
  }

  removeItem({key, storeKey}) {
    const items = this.getAll({storeKey: [storeKey]});
    delete items[key];

    this._storage.setItem(this._storeKey[storeKey], JSON.stringify(items));
  }

  getAll({storeKey}) {
    const emptyItems = {};
    const items = this._storage.getItem(this._storeKey[storeKey]);

    try {
      return JSON.parse(items);
    } catch (e) {
      // console.error(`Error parse items. Error: ${e}. Items: ${items}`);
      return emptyItems;
    }
  }
}

export default class Store {
  constructor({key, storage}) {
    this._storage = storage;
    this._storeKey = key;
  }

  setItem({key, item, sKey}) {
    const items = this.getAll({storeKey: sKey});
    items[key] = item;

    this._storage.setItem(this._storeKey[sKey], JSON.stringify(items));
  }

  getItem({key, sKey}) {
    const items = this.getAll({storeKey: sKey});
    return items[key];
  }

  removeItem({key, sKey}) {
    const items = this.getAll({storeKey: sKey});
    delete items[key];

    this._storage.setItem(this._storeKey[sKey], JSON.stringify(items));
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

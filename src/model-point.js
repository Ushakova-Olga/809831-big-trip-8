export default class ModelPoint {
  constructor(data) {
    if (data !== null) {
      this.id = data[`id`];
      this.type = data[`type`] || ``;
      this.time = {start: data[`date_from`], end: data[`date_to`]};
      this.price = data[`base_price`];
      this.destination = data[`destination`];
      this.isFavorite = data[`is_favorite`];
      let off = [];
      data[`offers`].forEach((it) => {
        let title2 = `unnamed`;
        if (it.title) {
          title2 = it.title;
        }
        off.push({title: title2, price: it.price, accepted: it.accepted});
      });
      this.offers = new Set(off);
    }
  }

  toRAW() {
    return {
      'id': this.id,
      'type': this.type,
      'offers': [...this.offers.values()],
      'date_from': this.time.start,
      'date_to': this.time.end,
      'base_price': this.price,
      'destination': this.destination,
      'is_favorite': this.isFavorite,
    };
  }

  static parsePoint(data) {
    return new ModelPoint(data);
  }

  static parsePoints(data) {
    return data.map(ModelPoint.parsePoint);
  }
}

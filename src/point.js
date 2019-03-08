import {renderOffers, createElement} from './common.js';

export default class Point {
  constructor(data) {
    this._type = data.type;
    this._city = data.city;
    this._picture = data.picture;
    this._offers = data.offers;
    this._time = data.time;
    this._price = data.price;
    this._duration = data.duration;
    this._description = data.description;

    this._element = null;
    this._state = {
      // Состояние компонента
    };

    this._onOpen = null;
  }

  _onOpenButtonClick() {
    if (typeof this._onOpen === `function`) {
      this._onOpen();
    }
  }

  get element() {
    return this._element;
  }

  set onOpen(fn) {
    this._onOpen = fn;
  }

  get template() {
    return `<article class="trip-point">
          <i class="trip-icon">${this._type.icon}</i>
          <h3 class="trip-point__title">${this._type.name} to ${this._city}</h3>
          <p class="trip-point__schedule">
            <span class="trip-point__timetable">${this._time.start}&nbsp;&mdash; ${this._time.end}</span>
            <span class="trip-point__duration">${this._duration}</span>
          </p>
          <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
          <ul class="trip-point__offers">
            ${renderOffers(this._offers)}
          </ul>
        </article>`;
  }

  bind() {
    this._element.addEventListener(`click`, this._onOpenButtonClick.bind(this));
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  unbind() {
    // Удаление обработчиков
  }

  unrender() {
    this.unbind();
    this._element = null;
  }
}

import Component from './component.js';
import moment from 'moment';

export default class Point extends Component {
  constructor(data) {
    super();
    this._day = data.day;
    this._type = data.type;
    this._city = data.city;
    this._picture = data.picture;
    this._offers = data.offers;
    this._time = data.time;
    this._price = data.price;
    this._duration = data.duration;
    this._description = data.description;

    this._onOpen = null;
    this._onOpenButtonClick = this._onOpenButtonClick.bind(this);
  }

  _onOpenButtonClick() {
    if (typeof this._onOpen === `function`) {
      this._onOpen();
    }
  }

  set onOpen(fn) {
    this._onOpen = fn;
  }

  renderOffers() {
    return [...this._offers].map((it) => `
    <li>
      <button class="trip-point__offer">${it.name}+&euro;&nbsp;${it.cost}</button>
    </li>
    `).join(``);
  }

  get template() {
    return `<article class="trip-point">
          <i class="trip-icon">${this._type.icon}</i>
          <h3 class="trip-point__title">${this._type.name} to ${this._city}</h3>
          <p class="trip-point__schedule">
            <span class="trip-point__timetable">${this._time.start} - ${this._time.end}</span>
            <span class="trip-point__duration">${this._duration}</span>
          </p>
          <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
          <ul class="trip-point__offers">
            ${this.renderOffers()}
          </ul>
        </article>`;
  }

  bind() {
    this._element.addEventListener(`click`, this._onOpenButtonClick);
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onOpenButtonClick);
  }

  update(data) {
    this._type = data.type;
    this._city = data.city;
    this._offers = data.offers;

    if (data.time.end !== ``) {
      this._time.end = data.time.end;
    }

    if (data.time.start !== ``) {
      this._time.start = data.time.start;
    }

    this._price = data.price;
    const start = Date.parse(moment(this._time.start, `HH:mm`).toDate());
    const end = Date.parse(moment(this._time.end, `HH:mm`).toDate());
    this._duration = Math.floor((end - start) / 3600000) + `H ` + Math.ceil(((end - start) % 3600000) / 60000) + `M`;

  }
}

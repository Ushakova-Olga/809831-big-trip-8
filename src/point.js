import Component from './component.js';
import moment from 'moment';
import {travelWay} from './common.js';

export default class Point extends Component {
  constructor(data) {
    super();
    this._id = data.id;
    this._type = data.type;
    this._offers = data.offers;
    this._time = data.time;
    this._price = data.price;
    this._destination = data.destination;
    this._isFavorite = data.isFavorite;
    this._duration = this._getDuration();

    this._onOpen = null;
    this._onOpenButtonClick = this._onOpenButtonClick.bind(this);
    this._countOffers = 3;
  }

  set onOpen(fn) {
    this._onOpen = fn;
  }

  get template() {
    return `<article class="trip-point">
          <i class="trip-icon">${travelWay[this._type].icon}</i>
          <h3 class="trip-point__title">${this._type} to ${this._destination.name}</h3>
          <p class="trip-point__schedule">
            <span class="trip-point__timetable">${this.renderTime(this._time.start)} - ${this.renderTime(this._time.end)}</span>
            <span class="trip-point__duration">${this._duration}</span>
          </p>
          <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
          <ul class="trip-point__offers">
            ${this.renderOffers()}
          </ul>
        </article>`;
  }

  _getDuration() {
    const days = Math.floor((this._time.end - this._time.start) / 86400000);
    const hours = Math.floor(((this._time.end - this._time.start) % 86400000) / 3600000);
    const minutes = Math.floor(((this._time.end - this._time.start) % 86400000) % 3600000 / 60000);
    if (days > 0) {
      return (`${days}D ${hours}H ${minutes}M`);
    }
    if (hours > 0) {
      return (`${hours}H ${minutes}M`);
    }
    return (`${minutes}M`);
  }

  renderOffers() {
    let i = 0;
    return [...this._offers].map((it) => {
      if ((i < this._countOffers) && (it.accepted)) {
        i++;
        return `<li>
          <button class="trip-point__offer">${it.title}+&euro;&nbsp;${it.price}</button>
        </li>
        `;
      }
      return ``;
    }).join(``);
  }

  renderTime(time) {
    return moment(time).format(`HH:mm`);
  }

  bind() {
    this._element.addEventListener(`click`, this._onOpenButtonClick);
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onOpenButtonClick);
  }

  update(data) {
    this._type = data.type;
    this._offers = data.offers;
    this._destination = data.destination;

    if (data.time.end !== ``) {
      this._time.end = data.time.end;
    }

    if (data.time.start !== ``) {
      this._time.start = data.time.start;
    }

    this._price = data.price;
    this._duration = this._getDuration();
  }

  _onOpenButtonClick() {
    if (typeof this._onOpen === `function`) {
      this._onOpen();
    }
  }
}

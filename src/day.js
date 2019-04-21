import {createElement} from './common.js';
import Component from './component.js';
import moment from 'moment';

export default class Day extends Component {
  constructor(data) {
    super();
    this._data = data.data;
    this._number = data.number;
  }

  get template() {
    return `
    <section class="trip-day trip-day--${moment(this._data).format(`MMM-D`)}">
        <article class="trip-day__info">
          <span class="trip-day__caption">Day</span>
          <p class="trip-day__number">${this._number}</p>
          <h2 class="trip-day__title">${moment(this._data).format(`MMM D`)}</h2>
        </article>

        <div class="trip-day__items">
        </div>
      </section>`;
  }

  insertPoint(pointElement) {
    this._element.querySelector(`.trip-day__items`).appendChild(pointElement);
  }

  replacePoints(pointElementFirst, pointElementSecond) {
    this._element.querySelector(`.trip-day__items`).replaceChild(pointElementFirst, pointElementSecond);
  }

  insertFirst(pointElement) {
    this._element.querySelector(`.trip-day__items`).insertBefore(pointElement, this._element.querySelector(`.trip-day__items`).firstElementChild);
  }

  removeElement(pointElement) {
    this._element.querySelector(`.trip-day__items`).removeChild(pointElement);
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  bind() {}

  unbind() {}
}

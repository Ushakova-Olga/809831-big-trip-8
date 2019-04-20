import {createElement} from './common.js';
import Component from './component.js';

export default class Sorting extends Component {
  constructor(data) {
    super();
    this._name = data.name;
    this._id = data.id;
    this._active = data.active;
    this._checked = data.checked;
    this._onSorting = this._onSorting.bind(this);
  }

  set onSorting(fn) {
    this._onSorting = fn;
  }

  get template() {
    const checked = this._checked ? `checked` : ``;

    if (this._active) {
      return `
      <label class="trip-sorting__item trip-sorting__item--${this._id}" for="sorting-${this._id}">
        <input type="radio" name="trip-sorting" id="sorting-${this._id}" value="${this._id}" ${checked}>
        <span class="trip-sorting__item--name">${this._name}</span>
      </label>
      `;
    }

    return `
    <span class="trip-sorting__item trip-sorting__item--${this._id}">${this._name}</span>`;
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  bind() {
    if (this._active) {
      this._element.querySelector(`input`).addEventListener(`change`, this._onSorting);
    }
  }

  unbind() {
    if (this._active) {
      this._element.querySelector(`input`).removeEventListener(`change`, this._onSorting);
    }
  }

  _onSorting(evt) {
    evt.preventDefault();

    if (typeof this._onSorting === `function`) {
      this._onSorting();
    }
  }
}

import {createElements} from './common.js';
import Component from './component.js';

export default class Filter extends Component {
  constructor(data) {
    super();
    this._name = data.name;
    this._id = data.id;
    this._count = data.count;
    this._checked = data.checked;

    this._onFilter = this._onFilter.bind(this);
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  _onFilter(evt) {
    evt.preventDefault();

    if (typeof this._onFilter === `function`) {
      this._onFilter();
    }
  }

  get template() {
    const checked = this._checked ? `checked` : ``;
    return `
    <input type="radio" id="filter-${this._id}" name="filter" value="${this._id}" ${checked}>
    <label class="trip-filter__item" for="filter-${this._id}">${this._name}</label>  `;
  }

  render() {
    this._element = createElements(this.template);
    this.bind();
    return this._element;
  }

  bind() {
    this._element[0].addEventListener(`change`, this._onFilter);
  }

  unbind() {
    this._element[0].removeEventListener(`change`, this._onFilter);
  }
}

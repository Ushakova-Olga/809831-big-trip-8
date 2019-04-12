import {createElement} from './common.js';
import Component from './component.js';

export default class TotalCost extends Component {
  constructor(cost) {
    super();
    this._cost = cost;
  }

  set setCost(cost) {
    this._cost = cost;
  }

  get template() {
    return `
      <p class="trip__total">Total: <span class="trip__total-cost">€&nbsp;${this._cost}</span></p>
  `;
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  bind() {

  }

  unbind() {

  }
}

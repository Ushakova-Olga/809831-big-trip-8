import Component from './component.js';
import moment from 'moment';
import {travelWay, offersDictionary} from './common.js';

export default class PointOpen extends Component {
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

    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onSubmit = null;
    this._onResetButtonClick = this._onResetButtonClick.bind(this);
    this._onReset = null;
    this._onChangeTravelWay = this._onChangeTravelWay.bind(this);
  }

  _processForm(formData) {
    const entry = {
      type: {},
      city: ``,
      offers: new Set(),
      time: ``,
      price: ``,
      duration: ``,
      description: ``,
    };

    const pointEditMapper = PointOpen.createMapper(entry);
    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (pointEditMapper[property]) {
        pointEditMapper[property](value);
      }
    }
    return entry;
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    const formData = new FormData(this._element.querySelector(`form`));
    const newData = this._processForm(formData);
    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }
    this.update(newData);
  }

  _onChangeTravelWay() {
    let travelWayContainer = this._element.querySelector(`.travel-way__select-group`);
    let checked = travelWayContainer.querySelector(`input:checked`);
    this._type.name = travelWay[checked.value].name;
    this._type.icon = travelWay[checked.value].icon;
    this.unbind();
    this._partialUpdate();
    this.bind();
  }

  _partialUpdate() {
    this._element.innerHTML = this.template;
  }

  _onResetButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onReset === `function`) {
      this._onReset();
    }
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  set onReset(fn) {
    this._onReset = fn;
  }

  renderOffers() {
    return [...this._offers].map((it) => `
    <input class="point__offers-input visually-hidden" type="checkbox" id="${it.name.toLocaleLowerCase().split(` `).join(`-`)}" name="offer" value="${it.name.toLocaleLowerCase().split(` `).join(`-`)}">
    <label for="${it.name.toLocaleLowerCase().split(` `).join(`-`)}" class="point__offers-label">
      <span class="point__offer-service">${it.name}</span> + €<span class="point__offer-price" name="offer-price">${it.cost}</span>
    </label>
    `).join(``);
  }

  get template() {
    return `<article class="point">
          <form action="" method="get">
            <header class="point__header">
              <label class="point__date">
                choose day
                <input class="point__input" type="text" placeholder="${moment(this._day).format(`MMM D`)}" name="day">
              </label>
                <div class="travel-way">
                <label class="travel-way__label" for="travel-way__toggle">${this._type.icon}</label>
                  <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">

                <div class="travel-way__select">
                  <div class="travel-way__select-group">
                    <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi" name="travel-way" value="taxi" ${this._type.name.toLocaleLowerCase() === `taxi` ? `checked` : ``}>
                    <label class="travel-way__select-label" for="travel-way-taxi">🚕 taxi</label>
                      <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus" name="travel-way" value="bus" ${this._type.name.toLocaleLowerCase() === `bus` ? `checked` : ``}>
                    <label class="travel-way__select-label" for="travel-way-bus">🚌 bus</label>
                      <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train" name="travel-way" value="train"${this._type.name.toLocaleLowerCase() === `train` ? `checked` : ``}>
                    <label class="travel-way__select-label" for="travel-way-train">🚂 train</label>
                      <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight" name="travel-way" value="flight" ${this._type.name.toLocaleLowerCase() === `flight` ? `checked` : ``}>
                    <label class="travel-way__select-label" for="travel-way-flight">✈️ flight</label>
                  </div>

                  <div class="travel-way__select-group">
                    <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in" name="travel-way" value="check-in"${this._type.name.toLocaleLowerCase() === `check-in` ? `checked` : ``}>
                    <label class="travel-way__select-label" for="travel-way-check-in">🏨 check-in</label>
                    <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing" name="travel-way" value="sight-seeing" ${this._type.name.toLocaleLowerCase() === `sight-seeing` ? `checked` : ``}>
                    <label class="travel-way__select-label" for="travel-way-sightseeing">🏛 sightseeing</label>
                  </div>
                </div>
              </div>

              <div class="point__destination-wrap">
                <label class="point__destination-label" for="destination">${this._type.name} to</label>
                <input class="point__destination-input" list="destination-select" id="destination" value="${this._city}" name="destination">
                <datalist id="destination-select">
                  <option value="airport"></option>
                  <option value="Geneva"></option>
                  <option value="Chamonix"></option>
                  <option value="hotel"></option>
                </datalist>
              </div>

              <label class="point__time">
                choose time
                <input class="point__input" type="text" value="${this._time}" name="time" placeholder="${this._time}">
              </label>

              <label class="point__price">
                write price
                <span class="point__price-currency">€</span>
                <input class="point__input" type="text" value="${this._price}" name="price">
              </label>

              <div class="point__buttons">
                <button class="point__button point__button--save" type="submit">Save</button>
                <button class="point__button" type="reset">Delete</button>
              </div>

              <div class="paint__favorite-wrap">
                <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite">
                <label class="point__favorite" for="favorite">favorite</label>
              </div>
            </header>

            <section class="point__details">
              <section class="point__offers">
                <h3 class="point__details-title">offers</h3>
                <div class="point__offers-wrap">
                  ${this.renderOffers()}
                </div>

              </section>
              <section class="point__destination">
                <h3 class="point__details-title">Destination</h3>
                <p class="point__destination-text">Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.</p>
                <div class="point__destination-images">
                  <img src="http://picsum.photos/330/140?r=123" alt="picture from place" class="point__destination-image">
                  <img src="http://picsum.photos/300/200?r=1234" alt="picture from place" class="point__destination-image">
                  <img src="http://picsum.photos/300/100?r=12345" alt="picture from place" class="point__destination-image">
                  <img src="http://picsum.photos/200/300?r=123456" alt="picture from place" class="point__destination-image">
                  <img src="http://picsum.photos/100/300?r=1234567" alt="picture from place" class="point__destination-image">
                </div>
              </section>
              <input type="hidden" class="point__total-price" name="total-price" value="">
            </section>
          </form>
        </article>`;
  }

  bind() {
    this._element.querySelector(`form`)
      .addEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`form`)
      .addEventListener(`reset`, this._onResetButtonClick);
    this._element.querySelector(`.travel-way__select-group`)
      .addEventListener(`change`, this._onChangeTravelWay);
  }

  unbind() {
    this._element.querySelector(`form`)
      .removeEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`form`)
      .removeEventListener(`reset`, this._onResetButtonClick);
    this._element.querySelector(`.travel-way__select-group`)
    .removeEventListener(`change`, this._onChangeTravelWay);
  }

  update(data) {
    this._type = data.type;
    this._city = data.city;
    this._offers = data.offers;
    this._time = data.time;
    this._price = data.price;
    this._duration = data.duration;
  }

  static createMapper(target) {
    let offerStr = ``;
    return {
      "travel-way": (value) => {
        target.type.name = travelWay[value].name;
        target.type.icon = travelWay[value].icon;
      },
      "destination": (value) => {
        target.city = value;
      },
      "time": (value) => {
        target.time = value;
      },
      "price": (value) => {
        target.price = value;
      },
      "offer": (value) => {
        offerStr = offersDictionary[value];
      },
      "offer-price": (value) =>{
        target.offers.add({offerStr, value});
      }
    };
  }
}

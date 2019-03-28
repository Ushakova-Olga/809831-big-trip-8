import Component from './component.js';
import moment from 'moment';
import {travelWay, travelWayFirst, travelWaySecond} from './common.js';
import flatpickr from 'flatpickr';
import {destinationsData, destinationsDict, offersDict} from './main.js';

export default class PointOpen extends Component {
  _getDuration() {
    const start = Date.parse(moment(this._time.start, `HH:mm`).toDate());
    const end = Date.parse(moment(this._time.end, `HH:mm`).toDate());
    return (Math.floor((end - start) / 3600000) + `H ` + Math.ceil(((end - start) % 3600000) / 60000) + `M`);
  }

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

    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onSubmit = null;

    this._onChangeTravelWay = this._onChangeTravelWay.bind(this);
    this._onChangeDestination = this._onChangeDestination.bind(this);

    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
    this._onDelete = null;
  }

  _processForm(formData) {
    const entry = {
      id: ``,
      type: ``,
      offers: [],
      time: {start: ``, end: ``},
      price: ``,
      destination: {},
      isFavorite: ``,
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
    let travelWayContainer = this._element.querySelector(`.travel-way__select`);
    let checked = travelWayContainer.querySelector(`input:checked`);
    this._type = travelWay[checked.value].name.toLocaleLowerCase();
    this._offers = (offersDict[checked.value.toLocaleLowerCase().split(` -`).join(``)]) ? offersDict[checked.value.toLocaleLowerCase().split(` -`).join(``)] : this._offers;

    this.unbind();
    this._partialUpdate();
    this.bind();
  }

  _onChangeDestination() {
    let destinationInput = this._element.querySelector(`.point__destination-input`);
    this._destination = destinationsDict[destinationInput.value];
    this._destination.pictures = [...this._destination.pictures];
    this.unbind();
    this._partialUpdate();
    this.bind();
  }

  _partialUpdate() {
    this._element.innerHTML = this.innerTemplate();
  }

  _onDeleteButtonClick() {
    if (typeof this._onDelete === `function`) {
      this._onDelete();
    }
  }


  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  set onDelete(fn) {
    this._onDelete = () => fn({id: this._id});
  }

  renderOffers() {
    return [...this._offers].map((it) => {
      const titleDashed = it.title ? it.title.toLocaleLowerCase().split(` `).join(`-`) : ``;
      return `
    <input class="point__offers-input visually-hidden" type="checkbox" id="${titleDashed}${it.price}" name="offer" value="${it.title}:${it.price}" ${it.accepted ? `checked` : ``}>
    <label for="${titleDashed}${it.price}" class="point__offers-label">
      <span class="point__offer-service">${it.title}</span> + €<span class="point__offer-price">${it.price}</span>
    </label>
    `;
    }).join(``);
  }

  renderTravelWaySelect(travelWayData) {
    return travelWayData.map((it) => `
    <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-${it.name}" name="travel-way" value="${it.name}" ${this._type.toLocaleLowerCase() === `${it.name}` ? `checked` : ``}>
    <label class="travel-way__select-label" for="travel-way-${it.name}">${it.icon} ${it.name}</label>
    `).join(``);
  }

  renderDataList(destinationData) {
    return `<label class="point__destination-label" for="destination">${this._type} to</label>
    <input class="point__destination-input" list="destination-select" id="destination" value="${this._destination.name}" name="destination">
    <datalist id="destination-select">
    ${destinationData.map((it) => `
    <option value="${it.name}"></option>
    `).join(``)}
    </datalist>`;
  }

  renderDestinationImages() {
    return `
    <div class="point__destination-images">
      ${[...this._destination.pictures].map((it) => `
        <img src="${it.src}" alt="${it.description}" class="point__destination-image">
        `).join(``)}
    </div>`;
  }

  innerTemplate() {
    return `<form action="" method="get">
                <header class="point__header">
                  <label class="point__date">
                    choose day
                    <input class="point__input" type="text" placeholder="18 Mar" name="day">
                  </label>
                    <div class="travel-way">
                    <label class="travel-way__label" for="travel-way__toggle">${travelWay[this._type].icon}</label>
                      <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">

                    <div class="travel-way__select">
                      <div class="travel-way__select-group">
                        ${this.renderTravelWaySelect(travelWayFirst)}
                      </div>

                      <div class="travel-way__select-group">
                        ${this.renderTravelWaySelect(travelWaySecond)}
                      </div>
                    </div>
                  </div>

                  <div class="point__destination-wrap">
                    ${this.renderDataList(destinationsData)}
                  </div>

                  <label class="point__time">
                    choose time
                    <input class="point__input date__start" type="text"  value="${moment(this._time.start).format(`h:mm`)}" name="date-start" placeholder="${moment(this._time.start).format(`h:mm`)}">
                    <input class="point__input date__end" type="text"  value="${moment(this._time.end).format(`h:mm`)}" name="date-end" placeholder="${moment(this._time.end).format(`h:mm`)}">
                  </label>

                  <label class="point__price">
                    write price
                    <span class="point__price-currency">€</span>
                    <input class="point__input" type="text" value="${this._price}" name="price">
                  </label>

                  <div class="point__buttons">
                    <button class="point__button point__button--save" type="submit">Save</button>
                    <button class="point__button point__button--delete" type="reset">Delete</button>
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
                    <p class="point__destination-text">${this._destination.description}</p>
                    ${this.renderDestinationImages()}
                  </section>
                  <input type="hidden" class="point__total-price" name="total-price" value="">
                </section>
              </form>`;
  }
  get template() {
    return `<article class="point">
          ${this.innerTemplate()}
        </article>`;
  }

  bind() {
    this._element.querySelector(`form`)
      .addEventListener(`submit`, this._onSubmitButtonClick);

    this._element.querySelector(`.travel-way__select-group`)
      .addEventListener(`change`, this._onChangeTravelWay);

    this._element.querySelector(`.point__destination-input`)
      .addEventListener(`change`, this._onChangeDestination);

    this._element.querySelector(`form`)
    .addEventListener(`reset`, this._onDeleteButtonClick);

    flatpickr(this._element.querySelector(`.point__time .date__start`), {enableTime: true, noCalendar: true, altInput: true, altFormat: `H:i`, dateFormat: `H:i`});
    flatpickr(this._element.querySelector(`.point__time .date__end`), {enableTime: true, noCalendar: true, altInput: true, altFormat: `H:i`, dateFormat: `H:i`});
  }

  unbind() {
    this._element.querySelector(`form`)
      .removeEventListener(`submit`, this._onSubmitButtonClick);

    this._element.querySelector(`.travel-way__select-group`)
    .removeEventListener(`change`, this._onChangeTravelWay);

    this._element.querySelector(`.point__destination-input`)
      .removeEventListener(`change`, this._onChangeDestination);

    this._element.querySelector(`form`)
      .removeEventListener(`reset`, this._onDeleteButtonClick);
  }

  update(data) {
    this._destination = data.destination;
    this._offers = data.offers;
    this._price = data.price;
    this._type = data.type;// ? data.type : this._type;
    this._time.end = data.time.end;
    this._time.start = data.time.start;
    this._duration = this._getDuration();
  }

  blockSave() {
    this._element.querySelector(`.point__button--save`).disabled = true;
    this._element.querySelector(`.point__button--save`).innerHTML = `Saving...`;
  }

  unblockSave() {
    if (this._element) {
      this._element.querySelector(`.point__button--save`).disabled = false;
      this._element.querySelector(`.point__button--save`).innerHTML = `Save`;
    }
  }

  blockDelete() {
    this._element.querySelector(`.point__button--delete`).disabled = true;
    this._element.querySelector(`.point__button--delete`).innerHTML = `Deleting...`;
  }

  unblockDelete() {
    this._element.querySelector(`.point__button--delete`).disabled = false;
    this._element.querySelector(`.point__button--delete`).innerHTML = `Delete`;
  }

  // Если произошла ошибка при загрузке дынных на сервер, показываем анимацию
  shake() {
    const ANIMATION_TIMEOUT = 600;
    this._element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._element.style.animation = ``;
    }, ANIMATION_TIMEOUT);
  }

  static createMapper(target) {

    return {
      "travel-way": (value) => {
        target.type = travelWay[value].name.toLocaleLowerCase();
      },
      "destination": (value) => {
        target.destination.name = value;
        target.destination.description = destinationsDict[value].description;
        target.destination.pictures = [...destinationsDict[value].pictures];
      },
      "date-start": (value) => {
        target.time.start = value ? Date.parse(moment(value, `h:mm`).toDate()) : ``;
      },
      "date-end": (value) => {
        target.time.end = value ? Date.parse(moment(value, `h:mm`).toDate()) : ``;
      },
      "price": (value) => {
        target.price = value;
      },
      "offer": (value) => {
        let arr = value.split(`:`);
        target.offers.push({title: arr[0], price: arr[1], accepted: true});
      },
    };
  }
}

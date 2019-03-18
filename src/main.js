import makeFilter from './make-filter.js';
import makeData from './data.js';
import Point from './point.js';
import PointOpen from './point-open.js';

const tripFilterForm = document.querySelector(`.trip-filter`);
const tripDayElement = document.querySelector(`.trip-day__items`);
const maxPoints = 10;

const getRandom = (count) => Math.floor(count * Math.random());

const renderTemplate = (template = ``) => {
  const templateElement = document.createElement(`template`);
  templateElement.innerHTML = template;
  return templateElement.content;
};

const renderPoints = (count) => {
  tripDayElement.innerHTML = ``;

  for (let i = 0; i < count; i++) {
    const point = makeData(i);
    const pointComponent = new Point(point);
    const pointOpenComponent = new PointOpen(point);

    tripDayElement.appendChild(pointComponent.render());

    pointComponent.onOpen = () => {
      pointOpenComponent.render();
      tripDayElement.replaceChild(pointOpenComponent.element, pointComponent.element);
      pointComponent.unrender();
    };

    pointOpenComponent.onSubmit = (newObject) => {
      point.type = newObject.type;
      point.city = newObject.city;
      point.picture = newObject.picture;
      point.offers = newObject.offers;
      point.time = newObject.time;
      point.price = newObject.price;
      point.duration = newObject.duration;
      point.description = newObject.description;
      pointComponent.update(point);
      pointComponent.render();
      tripDayElement.replaceChild(pointComponent.element, pointOpenComponent.element);
      pointOpenComponent.unrender();
    };

    pointOpenComponent.onReset = () => {
      pointComponent.render();
      tripDayElement.replaceChild(pointComponent.element, pointOpenComponent.element);
      pointOpenComponent.unrender();
    };
  }
};

const filtersData = [
  {id: `everything`, name: `Everything`, count: getRandom(maxPoints), checked: true},
  {id: `future`, name: `Future`, count: getRandom(maxPoints), checked: false},
  {id: `past`, name: `Past`, count: getRandom(maxPoints), checked: false}
];

const renderFilter = (data) => {
  const fragment = renderTemplate(makeFilter(data));
  const input = fragment.querySelector(`input`);
  input.addEventListener(`change`, () => renderPoints(data.count));
  return fragment;
};

const renderFilters = (data) => {
  const fragment = document.createDocumentFragment();
  data.forEach((filter) => fragment.appendChild(renderFilter(filter)));
  tripFilterForm.innerHTML = ``;
  tripFilterForm.appendChild(fragment);
};

renderFilters(filtersData);

import makeFilter from './make-filter.js';
import makePoint from './make-point.js';
import makeData from './data.js';

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
  const fragment = document.createDocumentFragment();
  let points = new Array(count);

  for (let i = 0; i < count; i++) {
    points[i] = makeData();
    fragment.appendChild(renderTemplate(makePoint(points[i])));
  }
  tripDayElement.innerHTML = ``;
  tripDayElement.appendChild(fragment);
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

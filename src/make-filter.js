export default (id, name, checked = false) =>
  `
  <input type="radio" id="filter-${id}" name="filter" value="${id}" ${checked ? `checked` : ``}>
  <label class="trip-filter__item" for="filter-${id}">${name}</label>  `;

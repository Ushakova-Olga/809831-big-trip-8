export default (data) => {
  const checked = data.checked ? `checked` : ``;
  return `
  <input type="radio" id="filter-${data.id}" name="filter" value="${data.id}" ${checked}>
  <label class="trip-filter__item" for="filter-${data.id}">${data.name}</label>  `;
};

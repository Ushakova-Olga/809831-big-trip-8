export function createElement(template) {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstElementChild;
}

export const travelWay = {
  'taxi': {name: `Taxi`, icon: `🚕`},
  'bus': {name: `Bus`, icon: `🚌`},
  'train': {name: `Train`, icon: `🚂`},
  'ship': {name: `Ship`, icon: `🛳`},
  'transport': {name: `Transport`, icon: `🚊`},
  'drive': {name: `Drive`, icon: `🚗`},
  'flight': {name: `Flight`, icon: `✈️`},
  'check-in': {name: `Check-in`, icon: `🏨`},
  'sightseeing': {name: `Sightseeing`, icon: `🏛`},
  'restaurant': {name: `Restaurant`, icon: `🍴`},
};

export const travelWaysFirst = [
  {name: `taxi`, icon: `🚕`},
  {name: `bus`, icon: `🚌`},
  {name: `train`, icon: `🚂`},
  {name: `ship`, icon: `🛳`},
  {name: `transport`, icon: `🚊`},
  {name: `drive`, icon: `🚗`},
  {name: `flight`, icon: `✈️`},
];

export const travelWaysSecond = [
  {name: `check-in`, icon: `🏨`},
  {name: `sightseeing`, icon: `🏛`},
  {name: `restaurant`, icon: `🍴`},
];

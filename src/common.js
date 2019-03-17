export function createElement(template) {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
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

export const offersDictionary = {
  'add-luggage': `Add luggage`,
  'switch-to-comfort-class': `Switch to comfort class`,
  'add-meal': `Add meal`,
  'choose-seats': `Choose seats`,
};

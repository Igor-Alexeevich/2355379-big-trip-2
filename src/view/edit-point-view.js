//import AbstractView from '../framework/view/abstract-view.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { formatDate } from '../utils.js';

function createEditPointTemplate(point, destination, allDestinations, allTypes, offersByType) {
  //console.log(point); // 27.25
  return `<form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>

            ${allTypes.map((type) => `
            <div class="event__type-item">
              <input id="event-${type}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${type}" ${type === point.type ? 'checked' : ''}>
              <label class="event__type-label event__type-label--${type}" for="event-${type}-1"> ${type}</label>
            </div>`).join('')}

          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${point.type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${allDestinations.map((item) => `<option value="${item}"></option>`).join('')}

        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(point.dateFrom, 'DD/MM/YY HH:mm')}"><!--18/03/19 12:25-->
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(point.dateTo, 'DD/MM/YY HH:mm')}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.basePrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">

        ${offersByType.map((item) => `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="${item.id}" type="checkbox" name="event-offer-${item.id}" ${point.offers.includes(item.id) ? 'checked' : ''}>
            <label class="event__offer-label" for="${item.id}">
              <span class="event__offer-title">${item.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${item.price}</span>
            </label>
          </div>`).join('')}

        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">${destination.name}</h3>
        <p class="event__destination-description">${destination.description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">

          ${destination.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}

          </div>
        </div>
      </section>
    </section>
  </form > `;
}

export default class EditPointView extends AbstractStatefulView {
  //
  constructor(point, destination, allDestinations, allTypes, offersByType) {
    super(); // вызвать конструктор родителя
    this._setState(point);
    //console.log(this._state);
    this.point = point;
    this.destination = destination;
    this.allDestinations = allDestinations;
    this.allTypes = allTypes;
    this.offersByType = offersByType;
  }

  init({ onCancelClick }) {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', onCancelClick);
    this.element.addEventListener('submit', onCancelClick); // повесил addEventListener напрямую, т.к. form это и есть this.element
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typePointHandler);
  }

  get template() {
    return createEditPointTemplate(this.point, this.destination, this.allDestinations, this.allTypes, this.offersByType);
  }

  #typePointHandler = (evt) => {
    this.updateElement({
      type: evt.target.value,
    });
    console.log(this._state);
  };
}

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
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
              <label class="event__type-label event__type-label--${type}" for="event-${type}-1">${type}</label>
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
            <input class="event__offer-checkbox  visually-hidden" value="${item.id}" id="${item.id}" type="checkbox" name="event-offer" ${point.offers.includes(item.id) ? 'checked' : ''}>
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
  //создание методов
  #getOffersByType = null;
  #getDestinationByName = null;
  #getDestinationById = null;
  #onCancelClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #onSubmit = null;

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

  init({ onCancelClick, onSubmit, getOffersByType, getDestinationByName, getDestinationById }) {
    this.#getOffersByType = getOffersByType;
    this.#getDestinationByName = getDestinationByName;
    this.#getDestinationById = getDestinationById;
    this.#onCancelClick = onCancelClick;
    this.#onSubmit = onSubmit;
    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state, this.destination, this.allDestinations, this.allTypes, this.offersByType);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#cancelEditHandler);
    //this.element.addEventListener('submit', this.onCancelClick); // повесил addEventListener напрямую, т.к. form это и есть this.element
    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typePointHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationPointHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceHandler);
    this.element.querySelectorAll('.event__offer-checkbox').forEach((elem) => {
      elem.addEventListener('change', this.#offersHandler);
    });
    this.#setDatepickerFrom();
    this.#setDatepickerTo();
  }

  #offersHandler = () => {
    const form = new FormData(this.element);
    this._setState({
      offers: form.getAll('event-offer')
    });
  };

  #priceHandler = (evt) => {
    this._setState({
      basePrice: Number(evt.target.value)
    });
  };

  #typePointHandler = (evt) => {
    this.offersByType = this.#getOffersByType(evt.target.value);
    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };

  #destinationPointHandler = (evt) => {
    this.destination = this.#getDestinationByName(evt.target.value);
    if (this.destination) {
      this.updateElement({
        destination: this.destination.id
      });
    }
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onSubmit(this._state);
  };

  #cancelEditHandler = () => {
    this.offersByType = this.#getOffersByType(this.point.type);
    this.destination = this.#getDestinationById(this.point.destination);

    this.updateElement(this.point);
    this.#onCancelClick();
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #setDatepickerFrom() {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/Y H:i',
        'time_24hr': true,
        enableTime: true,
        defaultDate: this._state.dateFrom,
        maxDate: this._state.dateTo,
        onChange: this.#dateFromChangeHandler, // На событие flatpickr передаём наш колбэк
      },
    );
  }

  #setDatepickerTo() {
    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/Y H:i',
        'time_24hr': true,
        enableTime: true,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler, // На событие flatpickr передаём наш колбэк
      },
    );
  }
}

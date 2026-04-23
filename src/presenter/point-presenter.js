import { replace, render, remove } from '../framework/render.js';

import PointView from '../view/point-view.js';

import EditPointView from '../view/edit-point-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #pointsModel = null;
  #listPoint = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({ point, pointsModel, listPoint, handlePointChange, onModeChange }) {
    this.#point = point;
    this.#pointsModel = pointsModel;
    this.#listPoint = listPoint;
    this.#handleDataChange = handlePointChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;
    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    // у очередного элемента по destination находим в points-model.js с функцией getDestinationById,
    const destination = this.#pointsModel.getDestinationById(this.#point.destination);
    // как в const point
    const offers = this.#pointsModel
      .getOffersByType(this.#point.type)
      .offers // массив 'offers': по типу в offers.js
      .filter((offer) => this.#point.offers.includes(offer.id)); // фильтрация id-шников в 'offers': в points.js

    const allDestinations = this.#pointsModel.getDestination().map((item) => item.name);
    const allTypes = this.#pointsModel.getOffers().map((item) => item.type);
    const offersByType = this.#pointsModel.getOffersByType(this.#point.type).offers;
    const getOffersByType = (type) => this.#pointsModel.getOffersByType(type).offers;
    const getDestinationByName = (name) => this.#pointsModel.getDestinationByName(name);
    const getDestinationById = (id) => this.#pointsModel.getDestinationById(id);

    this.#pointComponent = new PointView(this.#point, destination, offers);
    this.#pointComponent.init({
      onEditClick: () => {
        this.#replacePointToForm();
        document.addEventListener('keydown', this.#escKeyDownHandler);
      },
      onFavoriteClick: () => this.#handleFavoriteClick()
    });

    this.#pointEditComponent = new EditPointView(this.#point, destination, allDestinations, allTypes, offersByType);

    this.#pointEditComponent.init({
      onCancelClick: () => {
        this.#replaceFormToPoint();
        document.removeEventListener('keydown', this.#escKeyDownHandler);
      },
      getOffersByType,
      getDestinationByName,
      getDestinationById
    });
    render(this.#pointComponent, this.#listPoint.element);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#listPoint.element);
      return;
    }

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  #handleFavoriteClick() {
    this.#handleDataChange({ ...this.#point, isFavorite: !this.#point.isFavorite });
  }

  #handleSubmit() {
    this.#handleDataChange({ ...this.#point, isFavorite: !this.#point.isFavorite });
  }

  #replacePointToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();

      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

}

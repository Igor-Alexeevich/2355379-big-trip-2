import { render } from '../framework/render.js';
import BoardView from '../view/board.js'; // без скобок - импорт default, название может быть любое или повторяет с импорта
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';

import SortView from '../view/sort-view.js';

import MessageView from '../view/message-view.js';
import PointPresenter from './point-presenter.js';

export default class BoardPresenter {
  #listPoint = new BoardView();
  pointComponent = new PointView();
  editPointComponent = new EditPointView();
  messageComponent = new MessageView();
  #pointPresenters = new Map();

  constructor({ boardContainer, pointsModel }) { // параметр передан в main.js
    this.boardContainer = boardContainer; // создано свойство boardContainer у этого объекта
    this.pointsModel = pointsModel;
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter(point, this.pointsModel, this.#listPoint);
    pointPresenter.init();

  }

  // init(), инициализатор начальной загрузки, название придумал
  // вызывается в main.js
  init() {
    this.points = this.pointsModel.getPoints().slice();

    // добавить сортировку
    render(new SortView(), this.boardContainer); // по умолчанию идет добавление в конец контейнера, прописано в render.js (place = RenderPosition.BEFOREEND)

    // добавить список
    render(this.#listPoint, this.boardContainer);

    // проверить наличие точек и вывести сообщение
    if (this.points.length === 0) {
      render(this.messageComponent, this.boardContainer);
    } else {
      // добавить точки маршрута
      for (let i = 0; i < this.points.length; i++) {
        this.#renderPoint(this.points[i]);
      }
    }

  }
}


import icons from "../../img/icons.svg";

export default class View {
  _data;

  /**
   * render the received object to the DOM
   * @param {object | object[]} data the data to be renderd (e.g . recipe )
   * @param {boolean} [render = true] if false create markup string instead of rendering to the DOM
   * @returns {undefined | string}if render is set to false it will return the markup string
   */
  render(data, render = true) {
    this._data = data;

    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();

    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;

    const newMarkup = this._generateMarkup();

    const newDOM = document
      .createRange()
      .createContextualFragment(newMarkup);

    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const currentEelements = Array.from(
      this._parentElement.querySelectorAll("*")
    );

    newElements.forEach((newEL, i) => {
      const currentEL = currentEelements[i];

      if (
        !newEL.isEqualNode(currentEL) &&
        currentEL.firstChild?.nodeValue.trim("") !== ""
      ) {
        currentEL.textContent = newEL.textContent;
      }

      if (!newEL.isEqualNode(currentEL)) {
        Array.from(newEL.attributes).forEach((attr) => {
          currentEL.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  renderError(message = this._errorMessage) {
    const markup = `
          <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>

            <p>${message}</p>
          </div>`;

    this._clear();

    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderMessage(message = this._Message) {
    const markup = `
          <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>

            <p>${message}</p>
          </div>`;

    this._clear();

    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderSpinner() {
    const markup = `<div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`;

    this._clear();

    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}

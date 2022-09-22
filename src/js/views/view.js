/* FILE THAT IS THE PARENT OF VIEWS.
    EXPORT METHODS TO ALL VIEWS. */

import icons from 'url:../../img/icons.svg'; // // IMPORTING SVG IMG/ICONS TO PARCEL 2

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render = true] If false, create a markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render = false
   * @this {Object} View instance
   * @author Thomaz Gabriel
   */
  // PUT HTML ON THE PAGE
  render(data, render = true) {
    // CHECKS IF DATA EXISTS. IF NOT OR EMPTY QUERY SEARCH, RENDER ERROR MESSAGE
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // METHOD THAT ONLY UPDATE VALUES AND ATTRIBUTES ON THE DOM
  update(data) {
    // CHECKS IF DATA EXISTS. IF NOT OR EMPTY QUERY SEARCH, RENDER ERROR MESSAGE
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();

    this._data = data;
    const newMarkup = this._generateMarkup();
    // CONVERT THE MARKUP STRING INTO A VIRTUAL DOM OBJECT
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // STORE NEWELEMENTS OF VIRTUAL DOM AND CONVERT IT TO AN ARRAY
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // AND USE IT TO COMPARE TO ALL ELEMENTS OF THE ACTUAL DOM ON THE PAGE
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // IF CONTENT IS NOT THE SAME AND ELEMENTS ITS ONLY TEXT, UPDATE THE TEXT CONTENT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      // IF CONTENT IS NOT THE SAME, CHECKS FOR CHANGED ATTRIBUTES AND UPDATE ITS VALUES
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    // EMPTYING PREVIOUS HTML CONTENT
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
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
        </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // SUCCESS MESSAGE
  renderMessage(message = this._message) {
    const markup = `
        <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}

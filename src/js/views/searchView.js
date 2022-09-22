/* FILE THAT GETS THE SEARCH BAR QUERY AND LISTEN TO EVENT. */

class SearchView {
  _parentEl = document.querySelector('.search');

  // METHOD THAT RETURNS THE VALUE OF SEARCH INPUT FIELD
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  /* PUBLISHER-SUBSCRIBER PATTERN - PLACE WHERE YOU PUT EVENT HANDLERS
  PUBLISHER IS A CODE THAT KNOWS WHEN TO REACT: EVENT HANDLER (DOM)
  SUBSCRIBER IS A CODE THAT WANTS TO REACT
  EVENTS SHOULD BE HANDLED IN THE CONTROLLER (NO APPLICATION LOGIC IN THE VIEW)
  EVENTS SHOULD BE LISTENED FOR IN THE VIEW (NO DOM ELEMENTS IN THE CONTROLLER) */
  // HANDLERRENDER AS PUBLISHER
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault(); // PREVENTS PAGE RELOAD
      handler(); // SHOULD BE CONTROLSEARCHRESULT FUNCTION
    });
  }
}

// EXPORTING OBJECT (CLASS) SEARCHVIEW. ITS LIKE A NEW INSTANCE
export default new SearchView();

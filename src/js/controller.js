/* FILE THAT CONNECTS MODEL AND VIEW.
  RESPOND TO USER INPUTS AND PERFORM INTERACTION ON DATA MODEL. */

// IMPORTING MODEL AND VIEWS
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

// PARCEL CODE TO MAKE STATE PERSIST AND PAGE NOT RELOAD
// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// ASYNC FUNCTION TO GET RECIPES
const controlRecipes = async function () {
  try {
    // GET THE RECIPE ID
    const id = window.location.hash.slice(1);
    if (!id) return; // GUARD CLAUSE TO LOAD PAGE WITH NO ID

    // UPDATE RESULTSVIEW TO MARK SELECTED SEARCH RESULT
    resultsView.update(model.getSearchResultsPage());

    // UPDATE BOOKMARKSVIEW TO MARK SELECTED SEARCH RESULT
    bookmarksView.update(model.state.bookmarks);

    // LOADING SPINNER RENDER FROM VIEW
    recipeView.renderSpinner();

    // LOADING RECIPE FROM MODEL
    await model.loadRecipe(id);

    // RENDERING RECIPE OBJECT FROM MODEL TO HTML FROM VIEW
    recipeView.render(model.state.recipe);
    /* SAME AS const recipeView = new recipeView(model.state.recipe) */
  } catch (err) {
    // CALLS RENDERERROR FROM VIEW
    recipeView.renderError();
  }
};

// ASYNC FUNCTION TO GET SEARCH RESULTS
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // CALL METHOD GETQUERY FROM SEARCHVIEW
    const query = searchView.getQuery();
    if (!query) return;

    // CALL SEARCHRESULTS FUNCTION FROM MODEL TO LOAD RESULTS
    await model.loadSearchResults(query);

    // CALL RENDER FROM RESULTSVIEW PASSING THE SEARCHRESULTSPAGE TO RENDER RESULTS AND
    resultsView.render(model.getSearchResultsPage());

    // RENDER INITIAL PAGINATION BUTTONS PASSING THE ENTIRE STATE OBJECT
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

// RECEIVES GOTOPAGE FROM PAGINATIONVIEW
const controlPagination = function (goToPage) {
  // CALL RENDER FROM RESULTSVIEW PASSING THE RESULTSPAGE TO RENDER RESULTS AND
  resultsView.render(model.getSearchResultsPage(goToPage));

  // RENDER INITIAL PAGINATION BUTTONS PASSING THE ENTIRE STATE OBJECT
  paginationView.render(model.state.search);
};

// FUNCTION THAT CONTROL NUMBER OF SERVINGS
const controlServings = function (newServings) {
  // UPDATE THE RECIPE SERVINGS (IN STATE OBJECT)
  model.updateServings(newServings);
  // UPDATE THE RECIPE VIEW
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

// ADD A NEW BOOKMARK
const controlAddBookmark = function () {
  // IF RECIPE IS NOT BOOKMARKED, ADD IT
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  // IF RECIPE IS BOOKMARKED, DELETE IT
  else model.deleteBookmark(model.state.recipe.id);

  // UPDATE THE VIEW
  recipeView.update(model.state.recipe);

  // RENDER THE BOOKMARKS
  bookmarksView.render(model.state.bookmarks);
};

// HANDLER FUNCTION OF BOOKMARKS
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// HANDLER TO GET RECIPE FROM ADDRECIPEVIEW
const controlAddRecipe = async function (newRecipe) {
  try {
    // SHOWS LOADING SPINNER
    addRecipeView.renderSpinner();

    // UPLOAD THE NEW RECIPE DATA
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // RENDER RECIPE
    recipeView.render(model.state.recipe);

    // SHOWS SUCCESS MESSAGE
    addRecipeView.renderMessage();

    // CHANGE ID IN THE URL -> HISTORY API: PUSHSTATE -> CHANGE THE URL WITHOUT RELOADING THE PAGE
    // FIRST ARGUMENT: STATE, SECOND: TITTLE, THIRTY: URL
    window.history.pushState(null, '', `${model.state.recipe.id}`);

    // RENDER THE BOOKMARKVIEW TO ADD NEW RECIPE
    bookmarksView.render(model.state.bookmarks);

    // CLOSE FORM WINDOW AFTER SOME TIME TO SEE THE RECIPE
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

// FUNCTION THAT EXECUTE AT THE BEGINNING
const init = function () {
  // CALL HANDLERRENDER FROM RECIPEVIEW WITH THE PUBLISHER-SUBSCRIBER PATTERN
  bookmarksView.addHandlerRender(controlBookmarks); // CONTROLBOOKMARKS AS SUBSCRIBER
  recipeView.addHandlerRender(controlRecipes); // CONTROLRECIPES AS SUBSCRIBER
  recipeView.addHandlerUpdateServings(controlServings); // CONTROLSERVINGS AS SUBSCRIBER
  recipeView.addHandlerAddBookmark(controlAddBookmark); // CONTROLADDBOOKMARK AS SUBSCRIBER
  searchView.addHandlerSearch(controlSearchResults); // CONTROLSEARCHRESULTS AS SUBSCRIBER
  paginationView.addHandlerClick(controlPagination); // CONTROLPAGINATION AS SUBSCRIBER
  addRecipeView.addHandlerUpload(controlAddRecipe); // CONTROLADDRECIPE AS SUBSCRIBER
};

init();

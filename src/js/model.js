/*  FILE THAT MANAGES THE DATA MANIPULATION, LOGIC AND RULES OF APPLICATION. */

import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js'; // NOT NECESSARY BECAUSE OF REFACTORED AJAX FUNCTION
import { AJAX } from './helpers.js';

// CONTAINS ALL THE DATA IN ORDER TO BUILD OR APPLICATION
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  // GET OBJECT PROPERTIES PROPERLY FORMATTED
  const recipe = data.data.recipe;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), // && IS A SHORT CIRCUIT. IF RECIPE.KEY DON'T EXISTS, NOTHING HAPPENS
    // IF RECIPE.KEY EXISTS, RETURN THE OBJECT AS KEY
  };
};

export const loadRecipe = async function (id) {
  try {
    // LOADING RECIPE
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`); // GETS FUNCTION FROM HELPERS AND URL FROM CONFIG
    // CREATE RECIPE OBJECT FROM DATA RECEIVED FROM API
    state.recipe = createRecipeObject(data);

    // LOOP THROUGH ARRAY AND RETURN TRUE IF BOOKMARK ID IS THE SAME AS ID
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    console.log(state.recipe);
  } catch (err) {
    console.error(`${err} 💥💥💥`);
    throw err; // THROWS ERROR TO REJECT PROMISE
  }
};

// SEARCH FUNCTIONALITY
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    // SEARCH FOR RECIPES THAT HAVE THE QUERY AND OUR KEY
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    // GET OBJECT PROPERTIES PROPERLY FORMATTED
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }), // && IS A SHORT CIRCUIT. IF REC.KEY DON'T EXISTS, NOTHING HAPPENS
        // IF REC.KEY EXISTS, RETURN THE OBJECT AS KEY
      };
    });
    state.search.page = 1; // SET PAGINATION BACK TO 1 WHEN SEARCH NEW RECIPE
  } catch (err) {
    console.error(`${err} 💥💥💥`);
    throw err; // THROWS ERROR TO REJECT PROMISE
  }
};

// PAGINATION FUNCTIONALITY
// PAGE GETS THE DEFAULT VALUE OF STATE.PAGE -> 1
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page; // STORE THE CURRENT PAGE ON STATE
  // RETURN ONLY THE FIRST 10 RESULTS FROM SEARCH.RESULTS ARRAY
  const start = (page - 1) * state.search.resultsPerPage; // STARTS AT 0
  const end = page * state.search.resultsPerPage; // ENDS AT 9
  return state.search.results.slice(start, end);
};

// UPDATE SERVINGS SIZE
export const updateServings = function (newServings) {
  // MANIPULATE INGREDIENTS OF STATE OBJECT
  state.recipe.ingredients.forEach(ing => {
    /* FORMULA TO CALCULATE NEW QUANTITY OF SERVINGS
    NEWQTD = (OLDQTD * NEW SERVINGS) / OLDSERVINGS -> (2 * 8) / 4 = 4 */
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  // UPDATE SERVINGS IN STATE OBJECT
  state.recipe.servings = newServings;
};

// PERSIST BOOKMARKS AFTER PAGE LOAD
const persistBookmarks = function () {
  // SET ITEM A NAME AND CONVERT IT TO STRING
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// BOOKMARK FUNCTIONALITY
export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe); // ADD BOOKMARK
  // MARK CURRENT RECIPE (STATE.RECIPE) AS BOOKMARK
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // FIND THE INDEX OF RECIPE AND STORE IT
  const index = state.bookmarks.findIndex(el => el.id === id);
  // DELETE THE ELEMENT OF INDEX
  state.bookmarks.splice(index, 1);
  // MARK CURRENT RECIPE (STATE.RECIPE) AS NOT A BOOKMARKED
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

// SEND RECIPE TO THE API
export const uploadRecipe = async function (newRecipe) {
  try {
    // TAKE THE INPUT DATA AND TRANSFORM IT IN THE SAME FORMAT AS THE DATA THAT WE GET FROM API
    //  CONVERT IT TO AN ARRAY
    const ingredients = Object.entries(newRecipe)
      // FILTER THE FIRST ELEMENT TO 'INGREDIENT' AND SECOND TO NOT AN EMPTY STRING
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // MAP SECOND ELEMENT AND REMOVE ALL WHITE SPACES WITH REPLACEALL AND SPLIT THE STRING WITH ,
        // const ingArray = ing[1].replaceAll(' ', '').split(',');
        const ingArray = ing[1].split(',').map(el => el.trim());
        // CHECK THE FORMAT OF TYPED INPUT, IF IS WRONG THROW AN ERROR
        if (ingArray.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format.'
          );
        // DESTRUCTURE INTO AN OBJECT WITH QUANTITY, UNIT, DESCRIPTION,
        const [quantity, unit, description] = ingArray;
        // IF QUANTITY EXISTS CONVERT IT TO NUMBER, IF NOT IS NULL
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    // CREATE OBJECT READY TO UPLOAD TO API
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    // USE SENDJSON METHOD FROM HELPER WITH THE URL AND API KEY
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    // USE CREATERECIPEOBJECT TO FORMAT THE DATA
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

// FUNCTION THAT EXECUTE AT THE BEGINNING
const init = function () {
  // GET DATA FROM LOCAL STORAGE
  const storage = localStorage.getItem('bookmarks');
  // IF OBJECT EXISTS, CONVERT IT TO FROM STRING TO OBJECT AND STORE IT ON STATE.BOOKMARKS
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

// FOR DEBUGGING AND DEVELOPMENT
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks(); // UNCOMMENT TO CLEAR BOOKMARKS

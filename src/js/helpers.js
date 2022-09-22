/* FILE THAT CONTAINS FUNCTIONS THAT ARE REUSED OVER THE APPLICATION. */

import { TIMEOUT_SEC } from './config.js';

// FUNCTION THAT REJECTS PROMISE AFTER A CERTAIN TIME
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// AJAX REQUEST -> GETJSON AND SENDJSON FUNCTION
export const AJAX = async function (url, uploadData = undefined) {
  // LOADING RECIPE
  try {
    // IF UPLOADDATA EXISTS, CREATE AN OBJECT (UPLOADDATA) THAT CONTAINS A FEW PROPERTIES TO SEND
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url); // IF NOT, FETCH URL

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); // REJECTS THE PROMISE AFTER 10s
    const data = await res.json(); // CONVERT OBJECT TO JSON
    // IF RES URL IS INVALID, THROW NEW ERROR
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err; // THROWS THE ERROR TO THE PLACE WHERE FUNCTION ITS CALLED
  }
};

/* BOTH SENDJSON AND GETJSON FUNCTIONS WERE REFACTORED INTO AJAX FUNCTION
// FUNCTION THAT DO THE FETCHING AND CONVERT TO JSON
export const getJSON = async function (url) {
  // LOADING RECIPE
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); // REJECTS THE PROMISE AFTER 10s
    const data = await res.json(); // CONVERT OBJECT TO JSON
    // IF RES URL IS INVALID, THROW NEW ERROR
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err; // THROWS THE ERROR TO THE PLACE WHERE FUNCTION ITS CALLED
  }
};

// FUNCTION THAT DO THE FETCHING AND CONVERT TO JSON
export const sendJSON = async function (url, uploadData) {
  try {
    // CREATE AN OBJECT (UPLOADDATA) THAT CONTAINS A FEW PROPERTIES TO SEND
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    // LOADING RECIPE
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); // REJECTS THE PROMISE AFTER 10s
    const data = await res.json(); // CONVERT OBJECT TO JSON
    // IF RES URL IS INVALID, THROW NEW ERROR
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err; // THROWS THE ERROR TO THE PLACE WHERE FUNCTION ITS CALLED
  }
};
*/

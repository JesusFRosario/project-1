// Step 1: variables for html elements

// search input field and button elements
var searchFormEl = document.querySelector('#search-form');
var searchInputEl = document.querySelector('#search-input');
var searchBtnEl = document.querySelector('#search-btn');

// error modal
var modalOkBtn = document.querySelector('#closebtn');
var errorModalEl = document.querySelector('#error-modal');

// elements for card where data from covid API will output
var stateAbbrEl = document.querySelector('#state-name');
var stateTotalCasesEl = document.querySelector('#state-total-cases');
var stateNewCasesEl = document.querySelector('#state-new-cases-today');
var stateHospitalizedEl = document.querySelector('#state-hospitalized');
var stateInIcuEl = document.querySelector('#state-icu');
var stateFatalitiesEl = document.querySelector('#state-deaths');
var stateLastUpdatedEl = document.querySelector('#state-last-update');

//global variable to store state name
var stateName;

//Step 3: After user clicks search button, grab the value of value of user input and then fetch the data from the api.

var formSubmitHandler = function (event) {
  event.preventDefault();
  var stateName = searchInputEl.value.trim();
  //if user entered full name of state, convert to state
  if (stateName) {
    if (stateName.length > 2) {
      var stateName = convertRegion(stateName, TO_ABBREVIATED);
    }
    var apiUrl =
      'https://api.covidtracking.com/v1/states/' + stateName + '/current.json';
    fetch(apiUrl)
      .then(function (response) {
        // if request was successful, run function to display the state's data
        if (response.ok) {
          response.json().then(function (data) {
            console.log(apiUrl);
            displayStateData(data);
          });
        } else {
          errorModalEl.classList.add('is-active');
        }
      })
      .catch(function (error) {
        errorModalEl.classList.add('is-active');
      });
  }
};

//Step 4: create a function to display the output of the data from the API.

var displayStateData = function (data) {
  //displays the state name which is pulled from the API response data

  var stateName = convertRegion(data.state, TO_NAME);
  stateAbbrEl.textContent = stateName;
  //total cases
  stateTotalCasesEl.textContent = formatNumber(data.positive);
  //new cases today
  stateNewCasesEl.textContent = formatNumber(data.positiveIncrease);
  //Now hospitalized (confirmed + suspected)
  stateHospitalizedEl.textContent = formatNumber(data.hospitalizedCurrently);
  //Now in ICU (confirmed + suspected)
  stateInIcuEl.textContent = formatNumber(data.inIcuCurrently);
  //total number of deaths
  stateFatalitiesEl.textContent = formatNumber(data.death);
  stateLastUpdatedEl.textContent = new Date(data.lastUpdateEt).toLocaleString();
  //clear the search field
  searchInputEl.value = '';
};

//Step 2: Create event listener to listen for form submission (i.e, user enters state name and clicks Search) and then run the formSubmitHandler function we'll create in step 3 above.

searchFormEl.addEventListener('submit', formSubmitHandler);

//*****TO DO -  store to local storage (sorry i broke this...) *******
var store = function () {
  var stateName = document.getElementById('search-input').value;
  localStorage.setItem('state'), JSON.stringify(stateName);
  var content = JSON.parse(localStorage.getItem('state'));
  var head = document.getElementById('header');
  g = document.createElement('div');
  g.setAttribute('id', 'div-1');
  g.innerHTML = content;
  head.appendChild(g);
};

//adds commas to the numbers so they're more readable (e.g, 100000 --> 100,000)
function formatNumber(num) {
  var num_parts = num.toString().split('.');
  num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return num_parts.join('.');
}

var modalBtnSubmitHandler = function (event) {
  event.preventDefault();
  errorModalEl.classList.remove('is-active');
  searchInputEl.value = '';
};

modalOkBtn.addEventListener('click', modalBtnSubmitHandler);

// search input field and button elements
var searchFormEl = document.querySelector('#search-form');
var searchInputEl = document.querySelector('#search-input');
var searchBtnEl = document.querySelector('#search-btn');
// error modal
var modalOkBtn = document.querySelector('#closebtn');
var errorModalEl = document.querySelector('#error-modal');
// elements for card where data from covid API will output
var stateInfoContainerEl = document.querySelector('#state-info');
var stateAbbrEl = document.querySelector('#state-name');
var stateTotalCasesEl = document.querySelector('#state-total-cases');
var stateNewCasesEl = document.querySelector('#state-new-cases-today');
var stateHospitalizedEl = document.querySelector('#state-hospitalized');
var stateInIcuEl = document.querySelector('#state-icu');
var stateFatalitiesEl = document.querySelector('#state-deaths');
var stateLastUpdatedEl = document.querySelector('#state-last-update');
//global variable to store state name
var stateName;
//global variable to store search history container
var historyContainerEl = document.querySelector('#history-container');
var states = JSON.parse(localStorage.getItem('states')) || [];

var formSubmitHandler = function (event) {
  event.preventDefault();
  //get the state the user typed in:
  var stateName = searchInputEl.value.trim();
  fetchCovidData(stateName);
};

var fetchCovidData = function (stateName) {
  if (stateName) {
    if (stateName.length > 2) {
      var stateName = convertRegion(stateName, TO_ABBREVIATED);
    }
    //fetch covid data for state:
    var apiUrl =
      'https://api.covidtracking.com/v1/states/' + stateName + '/current.json';
    fetch(apiUrl)
      .then(function (response) {
        // if request was successful, run function to display the state's data
        if (response.ok) {
          response.json().then(function (data) {
            console.log(apiUrl);
            var stateName = convertRegion(data.state, TO_NAME);
            displayStateData(data, stateName);
            //clear input field:
            searchInputEl.value = '';
            //store in local storage
            addStateToSearchHistoryAndLocalStorage(stateName);
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

var displayStateData = function (data, stateName) {
  //displays the info for the state:
  stateAbbrEl.textContent = stateName;
  //total cases
  stateTotalCasesEl.textContent = formatNumber(data.positive);
  //new cases today
  stateNewCasesEl.textContent = formatNumber(data.positiveIncrease);
  //Now hospitalized (confirmed + suspected)
  stateHospitalizedEl.textContent = formatNumber(data.hospitalizedCurrently);
  //Now in ICU (confirmed + suspected)
  if (data.inIcuCurrently == null) {
    stateInIcuEl.textContent = 'N/A';
  } else {
    stateInIcuEl.textContent = formatNumber(data.inIcuCurrently);
  }
  //total number of deaths:
  if (data.death == null) {
    stateFatalitiesEl.textContent = 'N/A';
  } else {
    stateFatalitiesEl.textContent = formatNumber(data.death);
  }
  stateLastUpdatedEl.textContent = new Date(data.lastUpdateEt).toLocaleString();
};

var addStateToSearchHistoryAndLocalStorage = function (stateName) {
  for (var i = 0; i < states.length; i++) {
    //if the state is already in search history, do nothing.
    if (stateName === states[i]) return;
  }
  //otherwise, push the full state name into states array
  states.push(stateName);
  localStorage.setItem('states', JSON.stringify(states));
  addStatesToSearchHistory(stateName);
};

var addStatesToSearchHistory = function (stateName) {
  //create search history buttons
  var historyBtn = document.createElement('button');
  historyBtn.classList.add('button', 'is-fullwidth');
  historyBtn.setAttribute('searched-state', stateName);
  historyBtn.setAttribute('type', 'submit');
  historyBtn.textContent = stateName;
  historyContainerEl.appendChild(historyBtn);
};

//on page reload, grab states from array and recreate the search history buttons
var loadSearchListOnRefresh = function () {
  for (var i = 0; i < states.length; i++) {
    addStatesToSearchHistory(states[i]);
  }
};

//adds commas to the numbers so they're more readable (e.g, 100000 --> 100,000)
function formatNumber(num) {
  var num_parts = num.toString().split('.');
  num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return num_parts.join('.');
}

//error modal button handler
var modalBtnSubmitHandler = function (event) {
  event.preventDefault();
  //show modal if error encountered (e.g., user misspells state or state abbreviation)
  errorModalEl.classList.remove('is-active');
  //clear search field
  searchInputEl.value = '';
};

//history button handler

var historyBtnHandler = function (event) {
  var stateHistoryName = event.target.getAttribute('searched-state');
  event.preventDefault();
  fetchCovidData(stateHistoryName);
};

searchFormEl.addEventListener('submit', formSubmitHandler);
historyContainerEl.addEventListener('click', historyBtnHandler);
modalOkBtn.addEventListener('click', modalBtnSubmitHandler);

loadSearchListOnRefresh();

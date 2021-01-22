	// Step 1: variables for html elements

	// search input field and button elements
	var searchFormEl = document.querySelector("#search-form");
	var searchInputEl = document.querySelector("#search-input");
	var searchBtnEl = document.querySelector("#search-btn");

	// elements for message article section, where data from API will go.
	var stateAbbrEl = document.querySelector("#state-name");
	var stateNotes = document.querySelector("#state-notes");
	var primaryWebsite = document.querySelector("#primary-site");
	var secondaryWebsite = document.querySelector("#secondary-site");

	//declare global variable to store the state name that the user searched
	var stateAbbr;

	//Step 3: After user clicks search button, grab the value of value of user input and then fetch the data from the api. 

	var formSubmitHandler = function(event) {
		//prevent form from "submitting" or else the rest won't work:
		event.preventDefault();
		//grab the name of the state the user input in the search field and store in stateAbbr variable declared above:
		var stateAbbr = searchInputEl.value.trim();
		stateAbbr.toLowerCase();
		//if user entered data, fetch the data and output it. otherwise, throw errors as indicated:
		if (stateAbbr) {
			var apiUrl = "https://api.covidtracking.com/v1/states/" + stateAbbr + "/info.json";
			fetch(apiUrl)
				.then(function(response) {
					// if request was successful, we'll run a function to display the state's data, (which is right below this formSubmitHandler() function):
					if (response.ok) {
						response.json()
							.then(function(data) {
								console.log(apiUrl);
								displayStateData(data);
							});
					} else {
						alert('Error: ' + response.statusText);
					}
				})
				.catch(function(error) {
					alert('Unable to connect.');
				});
		}
	}

	//Step 4: create a function to display the output of the data from the API. 

	var displayStateData = function(data) {

		//displays the state name which is pulled from the API response data
		stateAbbrEl.textContent = data.state;
		//displays notes section pulled from the API response
		stateNotes.textContent = data.notes;
		//adds link for covid 19 primary website 
		primaryWebsite.href = data.covid19Site;
		//adds link for covid 19 to secondary website 
		secondaryWebsite.href = data.covid19SiteSecondary;
	}


	//Step 2: Create event listener to listen for form submission (i.i.e, user enters state name and clicks Search) and then run the formSubmitHandler function we'll create in step 3 above.

	searchFormEl.addEventListener('submit', formSubmitHandler);

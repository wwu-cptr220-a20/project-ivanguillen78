'use strict';

//An example of the response from searching for music on iTunes. Contains a
//`results` property that is an array of objects representing individual songs

//For practice, define a function `renderTrack()` that takes as an argument an
//Object representing a SINGLE song track (like an element of the above array) 
//and adds a new DOM element to the `#records` div representing that track. The 
//new DOM element should be an `<img>` with a `src` that is the track's 
//`artworkUrl100` property (the album cover), and both `alt` text and a `title` 
//attributes that include the name of the track.
//
//You may use either the DOM API or jQuery (you will need to load jQuery). 
//Note that the included CSS provides some default styling to `<img>` elements 
//(to make them look like records!)
//
//You can test this function by passing it one of the above array items
//(e.g., `EXAMPLE_SEARCH_RESULTS.results[0]).

function renderTrack(song) {
  let track = document.createElement('img');
  let caption = document.createElement('div');
  caption.classList.add('carousel-caption');
  let trackName = document.createElement('h3');
  let artistName = document.createElement('p');
  trackName.classList.add('app');
  artistName.classList.add('app');
  let div = document.querySelector('.carousel-inner');
  let newDiv = document.createElement('div');
  newDiv.classList.add('carousel-item');
  trackName.textContent = song.trackName;
  artistName.textContent = song.artistName;
  track.src = song.artworkUrl100;
  track.alt = song.trackName;
  track.classList.add('d-block');
  track.classList.add('w-70');
  track.addEventListener("click", function () {
    playTrackPreview(song, track)
  });
  caption.appendChild(trackName);
  caption.appendChild(artistName);
  newDiv.appendChild(track);
  newDiv.appendChild(caption);
  div.appendChild(newDiv);
}

function renderTrack2(song) {
  let track = document.createElement('img');
  let caption = document.createElement('div');
  caption.classList.add('carousel-caption');
  let trackName = document.createElement('h3');
  let artistName = document.createElement('p');
  trackName.classList.add('app');
  artistName.classList.add('app');
  let div = document.querySelector('.carousel-inner');
  let newDiv = document.createElement('div');
  newDiv.classList.add('carousel-item');
  newDiv.classList.add('active');
  trackName.textContent = song.trackName;
  artistName.textContent = song.artistName;
  track.src = song.artworkUrl100;
  track.alt = song.trackName;
  track.classList.add('d-block');
  track.classList.add('w-70');
  track.addEventListener("click", function () {
    playTrackPreview(song, track)
  });
  caption.appendChild(trackName);
  caption.appendChild(artistName);
  newDiv.appendChild(track);
  newDiv.appendChild(caption);
  div.appendChild(newDiv);
}


//Define a function `renderSearchResults()` that takes in an object with a
//`results` property containing an array of music tracks; the same format as
//the above `EXAMPLE_SEARCH_RESULTS` variable.
//The function should render each item in the argument's `results` array into 
//the DOM by calling the `renderTrack()` function you just defined. Be sure to 
//"clear" the previously displayed results first!
//
//You can test this function by passing it the `EXAMPLE_SEARCH_RESULTS` object.

function renderSearchResults(listOfSongs) {
  let records = document.querySelector('.carousel-inner');
  while (records.firstChild) {
    records.removeChild(records.firstChild);
  }
  if (listOfSongs.results == '') {
    renderError(new Error("No results found"));
  } 
  else {
    for (let i=0; i < listOfSongs.results.length; i++) {
      if (i == 0) {
        renderTrack2(listOfSongs.results[0]);
      } else {
      renderTrack(listOfSongs.results[i]);
      }
    }
  }
}


//Now it's the time to practice using `fetch()`! First, modify the `index.html`
//file to load the polyfills for _BOTH_ the fetch() function and Promises, so
//that your example will work on Internet Explorer.
//Use version 2.0.4 of the `fetch` polyfill.


//Define a function `fetchTrackList()` that takes in a "search term" string as a
//parameter and uses the `fetch()` function to downloads a list of tracks from 
//the iTunes Search API. You can use the below `URL_TEMPLATE` string for the URL,
//replacing `"{searchTerm}"` with the passed in search term (no {})
//Send the AJAX request, _then_ encode the response as JSON once it is received, 
//and _then_ should call you `renderSearchResults() function and pass it the 
//encoded data.
//
//IMPORTANT: Your `fetchTrackList()` method must also _return_ the Promise
//returned by the end of the `.then()` chain! This is so the method itself will
//be asynchronous, and can be further chained and utilized (e.g., by the tester).
//
//You can test this function by calling the method and passing it the name of 
//your favorite band (you CANNOT test it with the search button yet!)

function fetchTrackList(searchTerm) {
  let URL_TEMPLATE = 'https://itunes.apple.com/search?entity=song&limit=25&term=' + searchTerm;
  fetch(URL_TEMPLATE)  //start the download
    .then(function(response) {  //when done downloading
        let dataPromise = response.json();  //start encoding into an object
        return dataPromise;  //hand this Promise up
    })
    .then(function(data) {  //when done encoding
        //do something with the data!!
        renderSearchResults(data); //will now be encoded as a JavaScript object!
    })
    .catch(renderError);
} 


//Add an event listener to the "search" button so that when it is clicked (and 
//the the form is submitted) your `fetchTrackList()` function is called with the
//user-entered `#searchQuery` value. Use the `preventDefault()` function to keep
//the form from being submitted as usual (and navigating to a different page).

let searchButton = document.querySelector('button');

searchButton.addEventListener('click', function(event) {
  event.preventDefault();
  let search = document.querySelector('#searchQuery');
  fetchTrackList(search.value);
});



//Next, add some error handling to the page. Define a function `renderError()`
//that takes in an "Error object" and displays that object's `message` property
//on the page. Display this by creating a `<p class="alert alert-danger">` and
//placing that alert inside the `#records` element.

function renderError(errorObj) {
  let p = document.createElement('p');
  let records = document.querySelector('#records');
  p.classList.add('alert');
  p.classList.add('alert-danger');
  p.textContent = errorObj.message;
  records.appendChild(p);
}


//Add the error handing to your program in two ways:
//(1) Add a `.catch()` callback to the AJAX call in `fetchTrackList()` that
//    will render the error if one occurs in downloading or parsing.
//(2) Modify the above `renderSearchResults()` function so that if the `results`
//    array is empty, you instead call the `renderError()` function and pass
//    it an new Error object: `new Error("No results found")`
//
//You can test this error handling by trying to search with an empty query.


//Finally, add a "loading spinner" as user feedback in case the download takes a
//long time (so the page doesn't seem unresponsive). To do this, define a 
//function `togglerSpinner()` that modifies the existing `.fa-spinner` element 
//so that it is displayed if currently hidden, or hidden if currently displayed.
//Use the `classList.toggle()` method (or `.toggleClass()` with jQuery) to 
//toggle the presence of the `d-none` class.
//
//Modify the `fetchTrackList()` function once again so that you toggle the
//spinner (show it) BEFORE you send the AJAX request, and toggle it back off
//after the ENTIRE request is completed (including after any error catching---
//download the data and `catch()` the error, and `then()` show the spinner.

function toggleSpinner() {
  let spinner = document.querySelector('.fa-spinner');
  spinner.classList.toggle(d-none);
}




//Optional extra: add the ability to "play" each track listing by clicking
//on it. Modify the `renderTrack()` function to assign a `'click'` listener to
//each track image it creates. When that image is clicked, call the below function
//(passing in the track to play and the `img` to spin)!
//
//(This is provided for you as an example; take some time to read through the
//code logic to understand how this works.

const state = { previewAudio: new Audio() };

//Plays the given track, spinning the given image.
function playTrackPreview(track, img) {
  if(state.previewAudio.src !== track.previewUrl){ //if a new track to play
    document.querySelectorAll('img').forEach(function(element){
      element.classList.remove('fa-spin');
    }); //stop whoever else is spinning

    state.previewAudio.pause(); //pause current
    state.previewAudio = new Audio(track.previewUrl); //create new audio
    state.previewAudio.play(); //play new
    // img.classList.add('fa-spin'); //start the spinning
  } 
  else {
    if(state.previewAudio.paused){ 
      state.previewAudio.play();
    } else {
      state.previewAudio.pause();
    }
    // img.classList.toggle('fa-spin'); //toggle the spinning
  }
}

//Make functions and variables available to tester. DO NOT MODIFY THIS.
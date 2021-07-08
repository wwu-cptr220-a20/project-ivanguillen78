'use strict';

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

let searchButton = document.querySelector('button');

searchButton.addEventListener('click', function(event) {
  event.preventDefault();
  let search = document.querySelector('#searchQuery');
  fetchTrackList(search.value);
});

function renderError(errorObj) {
  let p = document.createElement('p');
  let records = document.querySelector('#records');
  p.classList.add('alert');
  p.classList.add('alert-danger');
  p.textContent = errorObj.message;
  records.appendChild(p);
}

const state = { previewAudio: new Audio() };

function playTrackPreview(track, img) {
  if(state.previewAudio.src !== track.previewUrl){ //if a new track to play
    document.querySelectorAll('img').forEach(function(element){
      element.classList.remove('fa-spin');
    });

    state.previewAudio.pause(); //pause current
    state.previewAudio = new Audio(track.previewUrl); //create new audio
    state.previewAudio.play(); //play new
  } 
  else {
    if(state.previewAudio.paused){ 
      state.previewAudio.play();
    } else {
      state.previewAudio.pause();
    }
  }
}


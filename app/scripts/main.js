// 1. This is our program
var program = {
								'12:00': 'Andrea Fraser (US)',
								'12:35': 'Christian Bök (CA) Kenneth Goldsmith (US)',
								'13:20': 'Mark Leckey (UK)',
								'14:10': 'Aram Bartholl (DE)',
								'15:00': 'Olia Lialina (RU)',
								'15:50': 'Etoy (EU)',
								'16:20': 'Minerva Cuevas (MX)',
								'16:45': 'Sibylle Peters (DE)',
								'17:15': 'Fred Wilson (US)',
								'18:15': 'Paola Pivi (IT)',
								'19:15': 'Andres Burbano (CO)',
								'19:40': 'David Claerbout (BE)',
								'21:05': 'Adrián Villar Rojas (AR)',
								'22:00': 'Barbara Visser (NL)',
								'22:25': 'Jérôme Bel (FR)',
								'22:50': 'Fay Nicolson (UK)'
							};

var videos = [
								'M7lc1UVf-VE',
								'M7lc1UVf-VE',
								'M7lc1UVf-VE',
								'M7lc1UVf-VE',
								'M7lc1UVf-VE',
								'X7JQu06ylFM',
								'M7lc1UVf-VE',
								'X7JQu06ylFM',
								'M7lc1UVf-VE',
								'X7JQu06ylFM',
								'M7lc1UVf-VE',
								'X7JQu06ylFM',
								'M7lc1UVf-VE',
								'X7JQu06ylFM',
								'M7lc1UVf-VE',
								'X7JQu06ylFM'
];

var starttime_global = 0;
var timeOuts = new Array(); 

buildProgram();

function initPlayer(){
	// another video ended
	player.destroy();
	buildPlayer();
}

function buildProgram() {
	var currenttime = Date.parse('now').getTime()/1000;	
	for (var key in program) {
		 if (program.hasOwnProperty(key)) {
		    $('.program dl').append( '<dt>' + key + '</dt><dd>' + program[key] + '</dd>' );
		 }
	}
}

var currentvideo = -1;

function nowPlaying() {
	clearTimeouts();
	var count = 0;
	var currenttime = Date.parse('now').getTime()/1000;
	for (var key in program) {
		 if (program.hasOwnProperty(key)) {
				var starttime = Date.parse( key ).getTime()/1000;
				// console.log( starttime );
				if( currenttime > starttime ){
					var currentvideo = count;
					starttime_global = starttime;
				}else{
					var remaining = starttime - currenttime;
					timeOuts[ key ] = setTimeout( function() {initPlayer()}, remaining*1000 );
					console.log( 'Set timeout: timeOuts[' +key+'] starting in: ' + remaining );
				}
		    count = count + 1;
		 }
	}
	console.log( currentvideo );
	return currentvideo
	//console.log( key, program[key] );
	//console.log( "video: " + count );
	//console.log( videos[count] );
}

function clearTimeouts() {  
  for (var key in timeOuts) {  
    clearTimeout(timeOuts[key]);  
  }  
  tomorrowRestart();
}  

var player = {};
function buildPlayer() {
	$('#player-container').show();
	var play = nowPlaying();
	console.log( 'play: ' + play );
	player = new YT.Player('player', {
		height: '100%',
		width: '100%',
		videoId: videos[ play ],
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		},
		playerVars: {
			'modestbranding': 1,
			'controls': 1,
			'disablekb': 1,
			'iv_load_policy': 3,
			'rel': 0,
			'showinfo': 0,
			'start': 0
		}
	});
}

function syncPlayer( event ) {
	console.log( 'global: ' + starttime_global);

	var currenttime = Date.parse('now').getTime()/1000;
  var duracion = event.target.getDuration();

  var timeInto = currenttime - starttime_global;
  console.log( 'timeInto: ' + timeInto );
	
	if( timeInto < duracion ){
		player.seekTo( timeInto );
		event.target.playVideo();
	}else{
		talkEnded();
	}
}

function talkEnded() {
	$('#player-container').hide();
}

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
	buildPlayer();
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	syncPlayer(event);
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
		if (event.data == YT.PlayerState.PLAYING && !done) {
			event.target.setVolume(0);
			done = true;
		}

		if ( event.data == YT.PlayerState.PAUSED ) {
				event.target.playVideo();
		}

		if ( event.data == YT.PlayerState.ENDED ) {
				talkEnded();
		}
}

function tomorrowRestart(){
	var currenttime = Date.parse('now').getTime()/1000;	
	var tomorrow = Date.parse('tomorrow').getTime()/1000;

	var untilTomorrow = tomorrow - currenttime;
	timeOuts[ 'tomorrow' ] = setTimeout( function() {initPlayer()}, untilTomorrow*1000 );

	console.log( 'The Artist Talk Fest Starts Again in: ' + untilTomorrow );
}
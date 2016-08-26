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
								'zpMVXWGtkVw',
								'pKPIIANZqsc',
								'rt3-suQlP6Q',
								'YkTZSWLT5JQ',
								'8ZV1dpn_ZdA',
								'7zOBv4l6_O8',
								'1UxZ1Oia1VA',
								'vov92LltM0c',
								'1N01zpp2YRM',
								'X7JQu06ylFM',
								'dC8aJpfuZ7c',
								'-NnPfI-td_A',
								'r9drIoldc0E',
								'_L1Kdj0Kr44',
								'NYNHyU4fDlI',
								'kh4b7aeHdBI'
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
		    $('.program dl').append( '<dt>' + key + '&nbsp;</dt><dd>' + program[key] + '</dd><br/>' );
		 }
	}
}

var currentvideo = -1;

function nowPlaying() {
	clearTimeouts();
	clearInterval( interval );
	var count = 0;
	currentvideo = -1;
	var currenttime = Date.parse('now').getTime()/1000;
	for (var key in program) {
		 if (program.hasOwnProperty(key)) {
				var starttime = Date.parse( key ).getTime()/1000;
				// console.log( starttime );
				if( currenttime >= starttime ){
					currentvideo = count;
					starttime_global = starttime;
				}else{
					var remaining = starttime - currenttime;
					timeOuts[ key ] = setTimeout( function() {initPlayer()}, remaining*1000 );
					console.log( 'Set timeout: timeOuts[' +key+'] starting in: ' + remaining );
				}
		    count = count + 1;
		 }
	}
	console.log( 'Now playing: ' + currentvideo );
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

	if( play == 0 ){
		// play = 1
	}
	console.log( 'play: ' + play );

	$('.current').removeClass('current');
	$('dt:nth-of-type('+ (play + 1 ) +'), dd:nth-of-type('+ (play + 1 ) +')').addClass('current');
	$('#nownext').text('NOW');
	$('#talk').text( $('dd.current').text() );

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
			'controls': 0,
			'disablekb': 1,
			'iv_load_policy': 3,
			'rel': 0,
			'showinfo': 0,
			'start': 0
		}
	});
}

var interval = 0;
function syncPlayer( event ) {
	console.log( 'global: ' + starttime_global);

	var currenttime = Date.parse('now').getTime()/1000;
	var duracion = event.target.getDuration();

	var timeInto = currenttime - starttime_global;
	console.log( 'timeInto: ' + timeInto );
	
	if( timeInto < duracion ){
		player.seekTo( timeInto );
		event.target.playVideo();
		clearInterval( interval );
		interval = setInterval( function(){ countdown( event ) }, 1000 );
	}else{
		clearInterval( interval );
		talkEnded();
	}
}

function countdown_upcoming( upto ){

	var currenttime = Date.parse('now').getTime()/1000;
	var upcomingvideo = currentvideo + 1;

	if( upcomingvideo == 1 ){
		upcomingvideo = 1;
	}
	console.log( 'counting to upcoming' );
	console.log( upcomingvideo );
	//if( upcomingvideo == 1 ){
	//	upcomingvideo = 0;
	//}

	$('.current').removeClass('current');
	$('dt:nth-of-type('+ (upcomingvideo + 1 ) +'), dd:nth-of-type('+ (upcomingvideo + 1 ) +')').addClass('current');

	$('#talk').text( $('dd:nth-of-type('+ ( upcomingvideo + 1 ) + ' )').text() );

	var next_time = $('dt:nth-of-type('+ ( upcomingvideo + 1 ) + ' )').text();

	$('#talk').text( $('dd:nth-of-type('+ ( upcomingvideo + 1 ) + ' )').text() );
	
	var tiempo = (new Date).clearTime().addSeconds( parseInt( Date.parse( next_time ).getTime()/1000 - currenttime ) ).toString('H:mm:ss');
	$('#countdown').text( tiempo );
}

function countdown( event ){
	console.log('updating countdown');

	var currenttime = Date.parse('now').getTime()/1000;
	var duracion = event.target.getDuration();

	var timeInto = currenttime - starttime_global;
	var tiempo = (new Date).clearTime().addSeconds( parseInt( duracion - timeInto ) ).toString('H:mm:ss');
	$('#countdown').text( tiempo );
}

function talkEnded() {
	$('#nownext').text('UPCOMING');
	clearInterval( interval );
	interval = setInterval( function(){ countdown_upcoming( 1 ) }, 1000 );
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
			event.target.setVolume(100);
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
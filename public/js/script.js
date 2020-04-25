/*eslint-env browser*/
//Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('./service-worker.js')
        .then(function () {
            //console.log('Service Worker Registered');
        });
    navigator.serviceWorker
        .register('./firebase-messaging-sw.js')
        .then(function () {
            //console.log('Service Worker Registered');
        });
}

var config;
var sensor;
var lastHealth = 0;

$(document).ready(function () {
//    var database = firebase.database().ref('/');

//    database.on('value', function (snapshot) {
//        config = snapshot.val().config;
//        sensor = snapshot.val().data;
//        update();
//    });


    var db_config = firebase.database().ref('/config');
    db_config.on('value', function (snapshot) {
        config = snapshot.val();
        update();
    });
    var db_data = firebase.database().ref('/data');
    db_data.on('value', function (snapshot) {
        sensor = snapshot.val();
        update();
    });
    
    setInterval(updateHealthChech, 1000);
});

function updateHealthChech() {
    var element  = $('#healthcheck');
    
    if(lastHealth == 0){
        element.text('Updating...');
        return;
    }
    
    var diff = (new Date().getTime() - lastHealth) / 1000;
    element.text(`${Math.round(diff)} seconds ago`);
    return;
    
    if(diff < 60) {
        element.text('Online');
        return;
    }
}

function update() {
    
    if(!config || !sensor) return;

    if(!config.sensors.pir.enabled) {
        $('#presence').hide();
    }
    if(!config.sensors.relay.enabled) {
        $('#relay-1').hide();
    }

    $('#temp-internal .live span.value').text(sensor.sensors.temperature.internal.reading.toPrecision(4));
    $('#temp-internal .live').attr('data-tooltip', new Date(sensor.sensors.temperature.internal.updated).toLocaleString());

    $('#temp-internal .min span.value').text(sensor.sensors.temperature.internal.sumary.min.reading.toPrecision(4));
    $('#temp-internal .min').attr('data-tooltip', new Date(sensor.sensors.temperature.internal.sumary.min.when).toLocaleString());
    $('#temp-internal .max span.value').text(sensor.sensors.temperature.internal.sumary.max.reading.toPrecision(4));
    $('#temp-internal .max').attr('data-tooltip', new Date(sensor.sensors.temperature.internal.sumary.max.when).toLocaleString());



    $('#temp-external .live span.value').text(sensor.sensors.temperature.external.reading.toPrecision(4));
    $('#temp-external .live').attr('data-tooltip', new Date(sensor.sensors.temperature.external.updated).toLocaleString());

    $('#temp-external .min span.value').text(sensor.sensors.temperature.external.sumary.min.reading.toPrecision(4));
    $('#temp-external .min').attr('data-tooltip', new Date(sensor.sensors.temperature.external.sumary.min.when).toLocaleString());
    $('#temp-external .max span.value').text(sensor.sensors.temperature.external  .sumary.max.reading.toPrecision(4));
    $('#temp-external .max').attr('data-tooltip', new Date(sensor.sensors.temperature.external.sumary.max.when).toLocaleString());

    
    $('#presence span').text(sensor.sensors.presence.reading == 1 ? "Present" : "None");
    if (sensor.sensors.presence.reading == 1) {
        $('#presence span').addClass('new');
    } else {
        $('#presence span').removeClass('new');
    }
    $('#presence span.badge').attr('data-tooltip', new Date(sensor.sensors.presence.updated).toLocaleString());

    $('#relay-1 span.badge').text(sensor.relay.relay1.state == 1 ? "On" : "Off");
    if (sensor.relay.relay1.state == 1) {
        $('#relay-1 span.badge').addClass('new');
    } else {
        $('#relay-1 span.badge').removeClass('new');
    }
    $('#relay-1 span.badge').attr('data-tooltip', new Date(sensor.relay.relay1.updated).toLocaleString());
    
    //$('#healthcheck').text(new Date(sensor.health.updated).toLocaleString());
    lastHealth = new Date(sensor.health.updated).getTime();
}

$(document).ready(function () {
    M.AutoInit();
//    $('.collapsible').collapsible();
    
    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.tooltipped');
        var instances = M.Tooltip.init(elems, options);
      });
});



//Performance
var perf = firebase.performance();

//Messaging
const messaging = firebase.messaging();
messaging.usePublicVapidKey("BFFpkVRUBTCCsHqgyenYKcFdP8Y7P6NeA7ngIxVMajiFm50Z_XbRRVFRqSfzwKrvdlE2NWd_hXZTg4QhwCxpZYQ");

var user = firebase.auth().currentUser;
if(user){
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        // TODO(developer): Retrieve an Instance ID token for use with FCM.
        // ...
      } else {
        console.log('Unable to get permission to notify.');
      }
    });
}

function sendTokenToServer(token){
    var user = firebase.auth().currentUser;
    if(user){
    firebase.database().ref('users/' + user.uid).set({
                "token": token
              });
    }
    console.log(token);
}
function showToken(token) {
    console.log(token);
}
function setTokenSentToServer(token) {
    console.log(token)
}


// Get Instance ID token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
messaging.getToken().then((currentToken) => {
  if (currentToken) {
    sendTokenToServer(currentToken);
    //updateUIForPushEnabled(currentToken);
  } else {
    // Show permission request.
    console.log('No Instance ID token available. Request permission to generate one.');
    // Show permission UI.
    //updateUIForPushPermissionRequired();
    setTokenSentToServer(false);
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
  showToken('Error retrieving Instance ID token. ', err);
  setTokenSentToServer(false);
});

// Callback fired if Instance ID token is updated.
messaging.onTokenRefresh(() => {
  messaging.getToken().then((refreshedToken) => {
    console.log('Token refreshed.');
    // Indicate that the new Instance ID token has not yet been sent to the
    // app server.
    setTokenSentToServer(false);
    // Send Instance ID token to app server.
    sendTokenToServer(refreshedToken);
    // ...
  }).catch((err) => {
    console.log('Unable to retrieve refreshed token ', err);
    showToken('Unable to retrieve refreshed token ', err);
  });
});

messaging.onMessage((payload) => {
  console.log('Message received. ', payload);
  // ...
});

/*
    Auth
*/
var uiConfig = {
signInSuccessUrl: '/',
signInOptions: [
  // Leave the lines as is for the providers you want to offer your users.
  firebase.auth.GoogleAuthProvider.PROVIDER_ID
],
// tosUrl and privacyPolicyUrl accept either url string or a callback
// function.
// Terms of service url/callback.
tosUrl: '/',
// Privacy policy url/callback.
privacyPolicyUrl: function() {
  window.location.assign('/');
}
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.


initApp = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            $('#logout').removeClass('hide');
            document.getElementById('logout').addEventListener('click', function() {
                firebase.auth().signOut();
              });
            firebase.database().ref('users/' + user.uid).set({
                username: user.displayName,
                email: user.email,
                profile_picture : user.photoURL
              });
        } else {
            ui.start('#firebaseui-auth-container', uiConfig);
            $('#logout').addClass('hide');
        }

    })
}
window.addEventListener('load', function() {
    initApp();
});

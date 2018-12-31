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
$(document).ready(function () {
    var database = firebase.database().ref('/');

    database.on('value', function (snapshot) {
        config = snapshot.val().config;
        sensor = snapshot.val().data;
        update();
    });
});

function update() {
    $('#temp-internal span.value').text(sensor.sensors.temperature.internal.reading.toPrecision(4));
    $('#temp-internal span.badge').attr('data-tooltip', new Date(sensor.sensors.temperature.internal.updated).toLocaleString());
    
    
    $('#temp-external span.value').text(sensor.sensors.temperature.external.reading.toPrecision(4));
    $('#temp-external span.badge').attr('data-tooltip', new Date(sensor.sensors.temperature.external.updated).toLocaleString());
    
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

}

$(document).ready(function () {
    M.AutoInit();
//    $('.collapsible').collapsible();
    
    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.tooltipped');
        var instances = M.Tooltip.init(elems, options);
      });
});


// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker
//   `messaging.setBackgroundMessageHandler` handler.
const messaging = firebase.messaging();
messaging.onMessage(function(payload) {
  console.log('Message received. ', payload);
  // ...
});



//Chart
/*
var ctx = document.getElementById('myChart').getContext('2d');
            var chart = new Chart(ctx, {
                // The type of chart we want to create
                type: 'line',

                // The data for our dataset
                data: {
                    labels: ["January", "February", "March", "April", "May", "June", "July"],
                    datasets: [{
                        label: "My First dataset",
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgb(255, 99, 132)',
                        data: [0, 10, 5, 2, 20, 30, 45],
                    }]
                },

                // Configuration options go here
                options: {}
            });
*/


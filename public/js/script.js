/*eslint-env browser*/
//Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('./service-worker.js')
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
    $('#temp-internal').text(sensor.sensors.temperature.internal.reading.toPrecision(4));
    $('#temp-external').text(sensor.sensors.temperature.external.reading.toPrecision(4));

    $('#presence').text(sensor.sensors.presence.reading == 1 ? "Present" : "None");
    if (sensor.sensors.presence.reading == 1) {
        $('#presence').addClass('new')
    } else {
        {
            $('#presence').removeClass('new')
        }
    }

    $('#relay-1').text(sensor.relay.relay1.state == 1 ? "On" : "Off");
    if (sensor.relay.relay1.state == 1) {
        $('#relay-1').addClass('new')
    } else {
        {
            $('#relay-1').removeClass('new')
        }
    }
}
M.AutoInit();
$(document).ready(function () {
    $('.collapsible').collapsible();
});






//Chart
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

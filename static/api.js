const key = "c4c78e63934b47e08ba24434222606";
const url1 = "https://api.weatherapi.com/v1/current.json";
const url2 = "https://api.weatherapi.com/v1/astronomy.json";

let lat, long, isNight, isRaining;

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        lat = position.coords.latitude;
        long = position.coords.longitude;

        let data = {
            key: key,
            q: lat + " " + long,
            aqi: "no"
        };

        $.ajax({
            type: "GET",
            url: url1,
            data: data,
            success: showChanges
        });
    });
}

function showChanges(response) {
    $("#weather > img").attr("src", response.current.condition.icon);
    $("#weather > p").html(`${response.current.temp_f}&deg;F`);
    $("body").css("background", "linear-gradient(180deg, #B0E0F2 0%, #F4FBFD 100%)");
    
    checkSunsetTime();

    if (response.current.precip_in > 0) {
        isRaining = true;
        $("body").css("background", "linear-gradient(180deg, #B9B9B9 0%, #F8F8F8 100%)");
        console.log(1);
    }

    setup();
}

function checkSunsetTime() {
    let now = new Date();

    let data = {
        key: key,
        q: lat + " " + long,
        dt: now.getFullYear() + "-" + now.getMonth() + "-" + now.getDay()
    };

    $.ajax({
        type: "GET",
        url: url2,
        data: data,
        success: setBackground
    });
}

function setBackground(response) {
    let sunset = response.astronomy.astro.sunset;
    let sunsetHour = parseInt(sunset.substring(0, 2));
    let sunsetMinute = parseInt(sunset.substring(3, 5));

    let sunrise = response.astronomy.astro.sunrise;
    let sunriseHour = parseInt(sunrise.substring(0, 2));
    let sunriseMinute = parseInt(sunrise.substring(3, 5));

    let now = new Date();
    let currentHour = now.getHours();
    let currentMinute = now.getMinutes();

    if (currentHour >= 12) {
        currentHour %= 12;
        if (currentHour < sunsetHour || (currentHour <= sunsetHour && currentMinute < sunsetMinute)) {
            isNight = true;
        }
    } else {
        if (currentHour < sunriseHour || (currentHour <= sunriseHour && currentMinute < sunriseMinute)) {
            isNight = true;
        }
    }

    if (isNight) {
        $("body").css("background", "#000000").css("color", "#ffffff");
    }
}
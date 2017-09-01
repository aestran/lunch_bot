module.exports = {
    getWeather: function(lat, long, callback){
        // Test data for Belfast (cloudy)
        lat = 54.583328;
        long = -5.93333;
        //Test data for sunny
        // lat = -15.77972;
        // long = -47.929722;
        var request = require('request');
        var clouds = ':cloud:';
        var rain = ':umbrella_with_rain_drops:';
        var sun = ':sunny:';
        var snow = ':snowflake:';
        var storm = ':lightning_cloud:';
        request(
            {
                method:'post',
                url:'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&appid=d10a51da871593f23667cae2377e15ae',
                json: true,
            }, function (error, response, body) {
                response = "The weather for "+ body.name + ": " + body.weather[0].main;
                console.log(response);
                switch (body.weather[0].main) {
                    case 'Clouds': console.log(clouds);
                        break;
                    case 'Rain': console.log(rain);
                        break;
                    case 'Clear': console.log(sun);
                        break;
                    case 'Snow':console.log(snow);
                        break;
                    default: console.log(body.weather[0].main)
                        break;
                }
                weather = response;
                callback(error,weather);
            });
    }, getMockWeather: function(object){
        return 'https://thenextweb.com/wp-content/blogs.dir/1/files/2010/05/maps-500x390.jpg';
    }
};

var Buz = function () {};

Buz.prototype.getWeather = function(callback){
        // Test data for Belfast (cloudy)
        lat = 54.583328;
        long = -5.93333;
        //Test data for sunny
        // lat = -15.77972;
        // long = -47.929722;
        var request = require('request');
        var clouds = ':cloud:';
        var rain = ':umbrella_with_rain_drops:';
        var sun = ':sunny:';
        var snow = ':snowflake:';
        var storm = ':lightning_cloud:';
        request(
            {
                method:'post',
                url:'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&appid=d10a51da871593f23667cae2377e15ae',
                json: true,
            }, function (error, response, body) {
            	console.log(response);
            	console.log(body);
                response = "The weather for "+ body.name + ": " + body.weather[0].main + ':cloud:';
                console.log(response);
                switch (body.weather[0].main) {
                    case 'Clouds': response + ':cloud:';
                        break;
                    case 'Rain': response + ':umbrella_with_rain_drops:';
                        break;
                    case 'Clear': console.log(sun);
                        break;
                    case 'Snow':console.log(snow);
                        break;
                    default: console.log(body.weather[0].main)
                        break;
                }
                weather = response;
                callback(error,weather);
            });
    }

    module.exports = new Buz();

require('make-runnable');
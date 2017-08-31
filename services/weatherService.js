var exec = require('child_process').exec;

var WeatherService = function () {};

WeatherService.prototype.getWeather = function (lat, long, radius) {
	return 'https://thenextweb.com/wp-content/blogs.dir/1/files/2010/05/maps-500x390.jpg';
}


module.exports = WeatherService;
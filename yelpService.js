var YelpService = function () {};

var cuisineOptions = [ 'Indian', 'Mexican', 'Italian', 'Chinese', 'Greek', 'British'];

YelpService.prototype.getCuisineOptions = function () {
	return cuisineOptions;
}

YelpService.prototype.getLocations = function () {
	return locations;
}

module.exports = YelpService;
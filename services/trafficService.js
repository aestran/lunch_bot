var exec = require('child_process').exec;

var TrafficeService = function () {};

TrafficeService.prototype.getStaticImageUrl = function (lat, long) {
	return 'https://thenextweb.com/wp-content/blogs.dir/1/files/2010/05/maps-500x390.jpg';
}

TrafficeService.prototype.getMockStaticImageUrl = function (lat, long) {
	return 'https://thenextweb.com/wp-content/blogs.dir/1/files/2010/05/maps-500x390.jpg';
}


module.exports = TrafficeService;
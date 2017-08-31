var exec = require('child_process').exec;

var YelpService = function () {};

var cuisineOptions = [ 'Indian', 'Mexican', 'Italian', 'Chinese', 'Greek', 'British'];

YelpService.prototype.getCuisineOptions = function () {
	return cuisineOptions;
}

YelpService.prototype.getLocations = function () {
	 var command = 'curl -X GET --header "Accept: application/json" --header "user-key: 5710431d2f61ba5cb589a35574cfe2ef" "https://developers.zomato.com/api/v2.1/categories"'

    exec(command, function(error, stdout, stderr) {

      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);

      if (error !== null) {
        console.log('exec error: ' + error);
      }

      return stdout;
  })
}

module.exports = YelpService;
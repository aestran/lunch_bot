module.exports = {
    getNutritionInfo: function(distance_miles, user_gender, user_weight, user_height, user_age){

        //temp variables for testing
        distance_miles=1.5
        user_gender='male'
        user_weight=92.5
        user_height=167.50
        user_age=26

         var request = require('request');
         var distanceToWalk = "walked " +distance_miles+ " miles"

         //Custom Headers
         var headersOpt = {
             "content-type": "application/json",
             "x-app-id": "ae389b9f",
             "x-app-key": "a13a91e0bb86400ccad625268fd26e3e"
         };
         request(
         {
             method:'post',
             url:'https://trackapi.nutritionix.com/v2/natural/exercise',
             form: {query:distanceToWalk,gender:user_gender,weight_kg:user_weight,height_cm:user_height,age:user_age},
             headers: headersOpt,
             json: true,
         }, function (error, response, body) {
             var apiResults = JSON.stringify(body);
             var healthData = JSON.parse(apiResults)
             var calorieCount = healthData.exercises[0].nf_calories
             //multiple result by 2 to get calories burned for roundtrip journey
             return Math.round(calorieCount*2)
         });
    }, getMockNutritionInfo: function(object){
        return 'https://thenextweb.com/wp-content/blogs.dir/1/files/2010/05/maps-500x390.jpg';
    }
};

require('make-runnable');



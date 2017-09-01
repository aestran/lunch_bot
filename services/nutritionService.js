module.exports = {
    getNutritionInfo: function(distance, user_gender, user_weight, user_height, user_age){

        //temp for testing
        distance=5
        user_gender='male'
        user_weight=92.5
        user_height=167.50
        user_age=26

         var request = require('request');
         var distanceWalked = "walked " +distance+ " miles"

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
             form: {query:distanceWalked,gender:user_gender,weight_kg:user_weight,height_cm:user_height,age:user_age},
             //json: {query:'walked 1 miles',gender:'male',weight_kg:92.5,height_cm:167.50,age:26},
             headers: headersOpt,
             json: true,
         }, function (error, response, body) {
             //console.log(body)
             var apiResult = JSON.stringify(body);
             var healthData = JSON.parse(apiResult)
             var calorieCount=healthData.exercises[0].nf_calories
             //console.log(Math.round(calorieCount*2))
             return Math.round(calorieCount*2)
         });
    }, getMockNutritionInfo: function(object){
        return 'https://thenextweb.com/wp-content/blogs.dir/1/files/2010/05/maps-500x390.jpg';
    }
};

require('make-runnable');
var zomato = require('zomato');
var Restaurant = require('./zomato/Restaurant.js');

let selectedCuisines = ["Mexican"];

let client = zomato.createClient({
    userKey: '4a3b30ef356a829e79e73f8886f0aa0e',
});

//3rd
function restaurants(locations, cuisines) {

    let cuisineIds = new Array();
    selectedCuisines.forEach(function(cuisine) {
        let cuisineId = getcuisineId(cuisine, cuisines);
        console.log("cuisineId returned " + cuisineId);
        cuisineIds.push(cuisineId);
    })

    client.search({
        entity_id: locations[0].id, //location id 
        entity_type: "city", // location type (city,subzone,zone , landmark, metro,group) 
        count: "3", // number of maximum result to display 
        start: "0", //fetch results after offset 
        radius: "10000", //radius around (lat,lon); to define search area, defined in meters(M) 
        cuisines: cuisineIds, //list of cuisine id's separated by comma 
        sort: "best", //choose any one out of these available choices 
        order: "desc" // used with 'sort' parameter to define ascending(asc )/ descending(desc) 

    }, function(err, restaurants) {
        if (!err) {
            let parsedResponse = JSON.parse(restaurants);
            let sortedRestaurents = new Array();
            parsedResponse.restaurants.forEach(function(restaurantData) {
                console.log("Restaurant data " + JSON.stringify(restaurantData));
                var restaurant = new Restaurant(restaurantData.restaurant);
                sortedRestaurents.push(restaurant);
            })
            console.log("Results: " + JSON.stringify(sortedRestaurents));

            sortedRestaurents.forEach(function(restaurant) {
                if (restaurant.id == "16675470") {
                    restaurant.mainImage = "https://b.zmtcdn.com/data/reviews_photos/4f6/e4938dc3f87c0bb187262df9d5e954f6_1482779714.jpg?fit=around%7C747%3A1328&crop=747%3A1328%3B%2A%2C%2A";
                } else if (restaurant.id == "16675084") {
                    restaurant.mainImage = "https://b.zmtcdn.com/data/reviews_photos/4f6/e4938dc3f87c0bb187262df9d5e954f6_1482779714.jpg?fit=around%7C747%3A1328&crop=747%3A1328%3B%2A%2C%2A";
                } else if (restaurant.id == "16674933") {

                }
            })

            return sortedRestaurents;
        } else {
            console.log(err);
        }
    });
}

//2nd
function getCuisines(locations) {
    client.getCuisines({
        city_id: locations[0].id,

    }, function(err, result) {
        if (!err) {
            let cuisineResult = JSON.parse(result);
            let cuisines = cuisineResult.cuisines;
            restaurants(locations, cuisines);
        } else {
            console.log(err);
        }
    });
}

function getCity(lat, long) {

}

//utils
function getcuisineId(cuisineName, cuisines) {
    let availableCuisines = cuisines;
    let cuisineId = "";
    availableCuisines.forEach(function(availableCuisine) {
        if (availableCuisine.cuisine.cuisine_name == cuisineName) {
            console.log("entered loop returning " + availableCuisine.cuisine.cuisine_id)
            cuisineId = availableCuisine.cuisine.cuisine_id;
        }
    })
    return cuisineId;
}


function addQuotes(string) {
    return '"' + string + '"';
}

module.exports = {
    requestLocations: function() {
        client.getCities({
                q: "Belfast",
                count: "1"
            },
            function(err, result) {
                if (!err) {
                    let cityResponse = JSON.parse(result);
                    let locations = cityResponse.location_suggestions;
                    let cuisines = getCuisines(locations);
                } else {
                    console.log(err);
                }
            })
    },
}

require('make-runnable');
var Restaurant = function (data) {
this.name = data.name;
this.address = data.location.address;
this.city = data.location.city;
this.lat = data.location.latitude;
this.long = data.location.longitude;
this.priceRange = data.price_range;
this.image = data.thumb;
this.rating = data.user_rating.aggregate_rating;
this.ratings = data.user_rating.votes;
this.mainImage = data.featured_image;
}

module.exports = Restaurant;
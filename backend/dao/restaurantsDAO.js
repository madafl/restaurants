//data access object DAO
import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;
//import { ObjectId } from "mongodb";

let restaurants;

export default class RestaurantsDAO {
    //as soon as server starts we get a reference to restaurant db
    //if it s not filled we fill with restaurants variable
    static async injectDB(conn){
        if (restaurants){
            return
        }
        try {
            //connect to db, name of db get collection restaurants
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants");
        } catch (e){
            console.error('Unable to establish a collection handle in restausrantsDAO:' +e );
        }
    }
    //get list of all restaurants in db
    static async getRestaurants({
        //what filters u want
        filters = null,
        //what page number u want
        page = 0,
        //how many restaurants per page
        restaurantsPerPage = 12,
    } = {}) {
        let query; 
        if ( filters) {
            if ("name" in filters) {
                // we set name in mongodb that if someone does a text search, which field will be queried
                // browse collection, indexes, create index
                query = {$text: { $search : filters["name"]}};
            } else if ("cuisine" in filters){
                query = {"cuisine" : {$eq : filters["cuisine"]}};
            } else if ( "zipcode" in filters) {
                query = { "address.zipcode": { $eq: filters["zipcode"]}};
            }
        }
        let cursor;
        try {
            cursor = await restaurants.find(query);
        } catch (e) {
            console.error('Unable to issue find command' + e); 
            return { restaurantsList: [], totalNumRestaurants: 0}           
        }
            const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page);
            try {
                const restaurantsList = await displayCursor.toArray();
                const totalNumRestaurants = page === 0 ? await restaurants.countDocuments(query) :0;

                return { restaurantsList, totalNumRestaurants}
            } catch (e) {
                console.error('Unable to convert cursor to array or problem couting documents' + e);
                return { restaurantsList: [], totalNumRestaurants:0}
            }
        }
//get the reviews from one collection and put them into restaurants
//http://localhost:5000/api/v1/restaurants/id/5eb3d668b31de5d588f4292a
        static async getRestaurantByID(id){
            try {
                const pipeline= [ //
                    {
                        $match: { 
                            _id: new ObjectId(id), // match id of a rest
                        },
                    },
                        {
                            //from review collection we create a pipeline that will match the restaurant_id
                            $lookup: { // lookup the reviews where restaurant_id is the one we are looking for
                                from: "reviews",
                                let: {
                                    id: "$_id",
                                },
                                pipeline: [
                                    {
                                        $match:{
                                            $expr:{
                                                $eq:["$restaurant_id","$$id"],
                                            },
                                        },
                                    },
                                    {
                                        $sort:{
                                            date:-1,
                                        },
                                    },
                                ],
                                as: "reviews",
                            },
                        },
                        {
                            $addFields: {
                                reviews:"$reviews",
                            },
                        },
                ]
                return await restaurants.aggregate(pipeline).next();
            } catch (e) {
                console.error('Something went wrong in restaurantsDAO: ' + e);
                throw e;
            }
        }
//http://localhost:5000/api/v1/restaurants/cuisines
        static async getCuisines() {
            let cuisines = [];
            try {
                cuisines = await restaurants.distinct("cuisine");
                return cuisines;
            } catch (e){
                console.error('Unable to get cuisines: ' + e);
                return cuisines;
            }
        }
    }



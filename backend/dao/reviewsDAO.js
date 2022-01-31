import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;
//fill the variable with reviews
import RegisterDAO from "./registerDAO.js";
let reviews;
let users; 

export default class ReviewsDAO {
    static async injectDB(conn) {
        //if reviews already exists 
        if (reviews) {
            return
        }
        try { 
            //else access the reviews connection 
            //if doesnt already exist, it will be craeted
            reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("reviews");
            users = await conn.db(process.env.RESTREVIEWS_NS).collection("users");
        } catch (e) {
            console.error('Unable to establish collection handles in userDAO' + e);
        }
    }
    // restaurant_id a mongodb object id
    static async addReview(restaurantId, user, review, date){
        try { 
            const userDB = await users.findOne({username: user.name});
            const reviewDoc = {
                user:{  name: userDB.username,
                        user_id:userDB._id}, //reviewDoc.user.user_id
                date: date,
                text: review,
                restaurant_id : ObjectId(restaurantId)
            }
            return await reviews.insertOne(reviewDoc)
        } catch (e) {
            console.error('Unable to post review: ' + e);
            return {error: e }
        }
    }
    // http://localhost:5000/api/v1/restaurants/review?text=very good soup22&review_id=61d424f2afb6c9114a0a2073&user_id=1234&name=madafl
    static async updateReview(reviewId, userId, text, date) {
        try {
            //reviewul cu idul corect si userul corect ( cel care l a creat)
            const updateResponse = await reviews.updateOne(
                { _id: ObjectId(reviewId)},
                {$set: {text: text, date:date}},
            )
            return updateResponse;
        } catch (e) {
            console.error('Unable to update review: ' + e);
        }
    }
//http://localhost:5000/api/v1/restaurants/review?id=61c1b718b16dc1652bda5442
    static async deleteReview( reviewId, name){
        if (name != null){
            try { 
                const find = await reviews.findOne({"_id" : ObjectId("61d30dd10a365663b7c53429")});
                const userDB = await users.findOne({username: name});
            
                const deleteResponse = await reviews.deleteOne({
                    _id: ObjectId(reviewId),
                    user: {"name": name,"user_id": userDB._id},
                })
                return deleteResponse;
            }
            catch (e) {
                console.error('Unable to delete review: ' + e);
                return {error: e}
            }
        } else {
            console.log('No user id.');
        }
    }
}
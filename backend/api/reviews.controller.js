import ReviewsDAO from "../dao/reviewsDAO.js";
// TODO: when click on a user, see all his reviews
export default class ReviewsController {
    //http://localhost:5000/api/v1/restaurants/review?text=very good soup499&restaurant_id=5eb3d668b31de5d588f4292c&user_id=1234&name=alabala
    static async apiPostReview(req, res, next) {
        try {
            // get from body of the request
            // folosind auth am acces aici la req.username
            if (!req.username) return res.json({message: "Neautentificat."})
            const restaurantId = req.query.restaurant_id;
            const review = req.query.text;
            const userInfo = {
                 name: req.body.name,
            }
            const date = new Date();
            const ReviewResponse = await ReviewsDAO.addReview(
                restaurantId,
                userInfo,
                review, 
                date
            )
            res.json({status:"success"});
        }
        catch (e){
            res.status(500).json("error: " + e.message);
        }
    }
    // http://localhost:5000/api/v1/restaurants/review?text=very good soup22&review_id=61d424f2afb6c9114a0a2073&user_id=1234&name=madafl
    static async apiUpdateReview(req, res, next) {
        try {
            // we get the userid from the body because we want to make sure that the user who updates is the one that created
            const reviewId = req.query.review_id;
            const text = req.query.text;
            const date = new Date();
            if (text !== ""){
                const reviewResponse = await ReviewsDAO.updateReview(
                reviewId,
                req.query.user_id,
                text,
                date
            );
            var {error} = reviewResponse;
            if(error) {
                res.status(400).json({error})
            }
            if (reviewResponse.modifiedCount == 0){
                throw new Error(
                    "unable to update review",
                )
            }
            res.json({status: "succes"})
            } else {
                res.status(500).json({ message : "Fara text."});
            }
            
        } catch (e) {
             res.status(500).json({ error: e.message});
        }
    }
    // http://localhost:5000/api/v1/restaurants/review?name=alabala&id=61d30dde0a365663b7c5342a&user_id=123455
    // check if the user id is the same as the user that delete
    static async apiDeleteReview(req, res, next) {
        try {
            const reviewId = req.query.id;
            const name = req.query.name;
            const reviewResponse = await ReviewsDAO.deleteReview(
                reviewId,
                name
            )
            res.json({ status: "success"});
        }
        catch (e) {
             res.status(500).json({error: e.message});
        }
    }
}
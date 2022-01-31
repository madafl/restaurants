import express from "express";
import RestaurantsController from "./restaurants.controller.js";
import ReviewsController from "./reviews.controller.js";
import RegisterController from "./register.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(RestaurantsController.apiGetRestaurants);
router.route("/id/:id").get(RestaurantsController.apiGetRestaurantById); //specific restaurant by id 
router.route("/cuisines").get(RestaurantsController.apiGetRestaurantCuisines); // list of cuisines

router
    .route("/review") 
    .post(auth, ReviewsController.apiPostReview)
    .put(auth, ReviewsController.apiUpdateReview)
    .delete(auth, ReviewsController.apiDeleteReview);

router 
    .route("/register")
    .post(RegisterController.apiPostRegister)

router
    .route("/login")
    .post(RegisterController.loginUser)
export default router;

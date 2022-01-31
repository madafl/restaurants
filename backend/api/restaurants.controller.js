import RestauransDAO from "../dao/restaurantsDAO.js";

export default class RestaurantsController {
    
    static async apiGetRestaurants(req, res, next) {
        const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage, 12) : 144;
        const page = req.query.page ? parseInt(req.query.page, 12) : 0;
      
        let filters = {}
        if (req.query.cuisine){
            filters.cuisine  = req.query.cuisine;
        } else if (req.query.zipcode){
            filters.zipcode = req.query.zipcode;
        } else if ( req.query.name) {
            filters.name = req.query.name;
        }

        const { restaurantsList, totalNumRestaurants } = await RestauransDAO.getRestaurants({
        filters,
        page,
        restaurantsPerPage,
        })

        let response = {
            restaurants: restaurantsList,
            page: page,
            filters:filters,
            entries_per_page:restaurantsPerPage,
        }
        res.json(response);
    }
//http://localhost:5000/api/v1/restaurants/id/5eb3d668b31de5d588f4292c
    static async apiGetRestaurantById(req, res, next){
        try {
          
            let id = req.params.id || {}; // look for id param
            let restaurant = await RestauransDAO.getRestaurantByID(id);
            if (!restaurant){
                res.status(404).json({error:"Not found"});
                return
            }     
            res.json(restaurant);  
        } catch (e) {
            console.log(e);
            res.status(500).json({error: e});
        }
    }

    static async apiGetRestaurantCuisines(req, res, next){
        try { 
            let cuisines = await RestauransDAO.getCuisines();
            res.json(cuisines);
        } catch (e) {
            console.log(e);
            res.status(500).json({error:e})
        }
    }
}

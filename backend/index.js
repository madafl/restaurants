import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import RestaurantsDAO from "./dao/restaurantsDAO.js";
import ReviewsDAO from "./dao/reviewsDAO.js";
import RegisterDAO from "./dao/registerDAO.js";

dotenv.config();
const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 8000;
MongoClient.connect(
    process.env.RESTREVIEWS_DB_URI
).catch(err=> {
    console.error(err.stack);
    process.exit(1);
})
.then( async client => {
    // apelate la pornirea aplicatiei
    await RestaurantsDAO.injectDB(client);
    await ReviewsDAO.injectDB(client);
    await RegisterDAO.injectDB(client);
    app.listen(port, ()=>{
           console.log( 'Listening on port ' + port + '. Ready to get some queriesss');
    }) 
})

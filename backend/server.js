import express from "express"
import cors from "cors"
import restaurants from "./api/restaurants.route.js"
// !!!! add current ip address in mongodb 
const app = express();
app.use(cors());
app.use(express.json()); // so the app knows we use json

app.use("/api/v1/restaurants", restaurants);
//daca este accesata o ruta nedefinita, utilizatorul primeste un mesaj 
app.use("*",(req, res)=> res.status(404).json({error: "Not found."}));

export default app;

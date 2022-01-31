import { ConnectionClosedEvent } from "mongodb";
import RegisterDAO from "../dao/registerDAO.js";
import jwt from "jsonwebtoken";
import { LocalStorage } from "node-localstorage";

export default class RegisterController {

    // http://localhost:5000/api/v1/restaurants/register?username=test&password=test
    static async apiPostRegister(req, res, next) {
        try {
            // get from body of the request
            
            const username = req.body.username;
            const password = req.body.password;
            if (username === "" || password === "" ){
                res.json({message: "campuri necompletate"})
            } else {
                const date = new Date();
            const userResponse = await RegisterDAO.addUser(
                username,
                password,
                date
            );
            const token = jwt.sign({ username: username }, 'appptmaster')
            return res.status(200).json({ user:token});
            }
            
        }
        catch (e){
            res.status(500).json("error: " + e.message);
        }
    }

    static async loginUser(req, res, next) {
        try {
            
            const username = req.body.username;
            const password = req.body.password;
            let userResponse = await RegisterDAO.login(username, password);
            
            if (userResponse === true) {
                const token = jwt.sign({ username: username }, 'appptmaster')
                return res.status(200).json({ user:token});
            } else {
                return res.status(500).json({message:"Eroare la conectare", user:false});
            }
        }
        catch (e){
            res.status(500).json("error: " + e.message);
        }
    }
   


}

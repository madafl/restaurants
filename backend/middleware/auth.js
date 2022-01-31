import jwt from "jsonwebtoken";

// cand utilizatorul vrea sa stearga/editeze/ posteze review => auth middleware => care confirma daca are permisiunea (next())
const auth = async ( req, res, next) => {
    try {
        const token = req.headers.authorization;
        let decodedToken;
        if ( token) {
            decodedToken = jwt.verify(token,"appptmaster");
            req.username = decodedToken?.username;
        }
        next();
    } catch (error) {
        console.log(error)
    }
}

export default auth;

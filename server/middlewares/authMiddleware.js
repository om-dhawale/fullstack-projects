import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(400).json({message:"please provide the token"})
    } 
    const authString = authHeader.split(" ");
    const token = authString[1];
    try {
        const result = jwt.verify(token, process.env.JWT_SECRET);
        req.user = result;
        next();
        // res.status(200).json({message:"you are authorized"})
    } catch (error) {
        res.status(400).json({message:"the token is invalid or tampered with"})
    }
    
}
export default authMiddleware;
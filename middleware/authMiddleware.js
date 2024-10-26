const jwt = require('jsonwebtoken');
const authMiddleware = (req,res,next) => {
    const {token} = req.cookies;
    console.log(token)
    if(!token){
        return res.status(401).json({
            success : false,
            message : "UnAuthorized User",
        })
    }
    const user = jwt.verify(token,process.env.JWT_SECRET);
   req.user = user.userId;
   next();
}
module.exports = authMiddleware;
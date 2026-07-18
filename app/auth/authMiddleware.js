import jwt from "jsonwebtoken"
import { jwt_access_secret } from "../config/config.js"

export const  authMiddleware = async(req, res, next)=>{
    try{
        let token = req.cookies.access_token

        if(token){
            const decode = await jwt.verify(token, jwt_access_secret)

            // set headers
            req.headers["id"] = decode["id"]
            req.headers["email"] = decode["email"]

            // req.user = {
            //     id: decode["id"],
            //     email: decode["email"]
            // }
            next()
        }else{
            res.send("unauthorized")
        }
        
    }catch(err){
        res.send(err)
    }
}

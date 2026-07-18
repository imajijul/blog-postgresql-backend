import { cookieOptions, jwt_refresh_secret } from "../config/config.js"
import { dbconnect } from "../database/db.js"
import {UAParser} from "ua-parser-js";
import { generateAccessToken, generateRefreshToken } from "../utility/tokenUtility.js";
import jwt from "jsonwebtoken"

export const registerUserController = async (req, res)=>{
    try {
        const {name, email, phone, password} = req.body
        let register_query = `INSERT INTO users(name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING *`
        let result = await dbconnect.query(register_query, [name, email, phone, password])
        res.send(result.rows)
    } catch (err) {
        res.send(err.message)
    }
}

// login user
export const loginUserControler = async (req, res)=>{
    try {
        // device info
        // const parser = new UAParser(req.headers["user-agent"])
        // const browser = parser.getBrowser().name
        // const os = parser.getOS().name
        // const device = parser.getDevice().name
        // const ip = req.ip
        // const agent = req.headers["user-agent"]

        const {email, password} = req.body

        let login_query = `SELECT id, email, password FROM users WHERE email = $1 AND password = $2`

        // let ip_check = await dbconnect.query(`SELECT * FROM user_devices WHERE ip_address = $1`, [ip])

        let result = await dbconnect.query(login_query, [email, password])

        if(email === result.rows[0].email & password=== result.rows[0].password){
            let email = result.rows[0].email
            let id = result.rows[0].id

            let access_token  = await generateAccessToken(id, email)
            let refresh_token = await generateRefreshToken(id, email)
            console.log(refresh_token)
            let refresh_query = `UPDATE users SET refresh_token=$1 WHERE id = $2`
            let refresh_added = await dbconnect.query(refresh_query, [refresh_token, id])
            
            // let device_query = `INSERT INTO user_devices (user_id, browser, os, device_name, user_agent, ip_address, refresh_token) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`
            // let device_result = await dbconnect.query(device_query, [id, browser, os, device, agent, ip, "14257asfavbasfjiohn" ])
            
            res
            .cookie("access_token", access_token, cookieOptions)
            .cookie("refresh_token", refresh_token, cookieOptions)
            .send(refresh_added)



        }else{
            res.send("incorrect email or passwrod")
        }
        // if(result.rows[0] === null | result.rows.length===0){
            
        // }else{
        //     res.send("logout first")
        // }

        
    } catch (err) {
        res.send(err.message)
    }
}

export const logoutController = async (req, res)=>{
    try {
        if(req.cookies.token){
            res.cookie("token", "", {...cookieOptions, maxAge: 1})
            res.send("logout success")
        }else{
            res.send("please! login user")
        }
         
    } catch (err) {
        res.send(err.message)
    }
}


// // export const registerUserController = async (req, res)=>{
//     try {
        
//     } catch (err) {
//         res.send(err.message)
//     }
// }


export const accessRefreshController = async (req, res)=>{
    try {
        const incomming_refreshToken = req.cookies.refresh_token || req.body.refresh_token || req.headers.refresh_token

        if(!incomming_refreshToken){
            res.send("go to login page")
        }
        let decodedToken = await jwt.verify(incomming_refreshToken, jwt_refresh_secret)

        let user_find_query =  `SELECT * FROM users WHERE id=$1 AND email = $2`
        let user = await dbconnect.query(user_find_query, [decodedToken.id, decodedToken.email])
  
        if(!user.rows[0]){
            return res.send("User not found")
        }

        if(incomming_refreshToken !== user.rows[0].refresh_token){
            res.send("token expired")
        }
        const newaccess_token = await generateAccessToken(user.rows[0].id, user.rows[0].email)
        
        res
        .cookie("access_token", newaccess_token, cookieOptions)
        .send("login success")
        
    } catch (err) {
        res.send(err.message)
    }
}

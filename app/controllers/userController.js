import { dbconnect } from "../database/db.js"
import bcrypt from "bcrypt"
import { generateAccessToken } from "../utility/tokenUtility.js";
import { cookieOptions } from "../config/config.js";

export const registerUserController = async (req, res)=>{
   try {
        const {name, email, phone, password} = req.body
        const hashedPassword = await bcrypt.hash(password, 12)
        
        const find_user_query = `SELECT email FROM users WHERE email=$1`
        let find_user = await dbconnect.query(find_user_query, [email])
        if(find_user.rows[0] && find_user.rows[0].email){
            return res.json({success: false, message: "user already exist"})
        }
        
        let register_query = `INSERT INTO users(name, email, password, phone) VALUES ($1, $2, $3, $4)`
        await dbconnect.query(register_query, [name, email, hashedPassword, phone])
        
        res.json({success: true, message: "registration success"})
    } catch (err) {
        console.log(err)
        res.json({success: false, message: err.message})
    }
}

// login user
export const loginUserControler = async (req, res)=>{
    try {
        const {email, password} = req.body

        // step-1: input value check
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        let login_query = `SELECT u.id, u.email, u.password, u.status, r.name AS role_name FROM users u JOIN roles r ON u.role_id = r.id  WHERE email = $1`

        // step-2: fetch user by email
        let result = await dbconnect.query(login_query, [email])
        let user = result.rows[0]
        if(result.rows.length === 0){
            return res.status(400).json({
                success: false,
                message: "email not registered"
            })
        }

        // step-3: compare password
        let isMatched = await bcrypt.compare(password, user.password)
        
        if(!isMatched){
            return res.status(400).json({
                success: false,
                message: "ivalid email or password"
            })
        }
        
        // step-4: check account status
        if(user.status === "block"){
            return res.status(400).json({
                success: false,
                message: "Your account is blocked. Please submit an appeal."
            })
        }

        // step-5: generate token and login success
        let access_token  = await generateAccessToken(user.id, user.email, user.role_name)
        return res
        .cookie("access_token", access_token, cookieOptions)
        .json({success: true, message: "login success"})
    } catch (err) {
        console.log(err)
        res.json({success: false, message: err.message})
    }
}
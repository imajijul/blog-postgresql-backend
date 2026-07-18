import { dbconnect } from "../database/db.js"
import {decodedToken} from "../utility/tokenUtility.js"

export const createBloConroller = async(req, res)=>{
    try{
        const {title, description} = req.body
        const reg_query = `INSERT INTO blogs (title, description, author) VALUES ($1, $2, $3) RETURNING *`
        const authorId = req.headers["id"]
        const result = await dbconnect.query(reg_query, [title, description, authorId])
        res.send(result.rows)
    }catch(err){
        res.send(err.message)
    }
}

export const getSingleBlogController = async(req, res)=>{
    try {
        const {id} = req.params
        const reg_query = `SELECT * FROM blogs WHERE id = $1`

        const result = await dbconnect.query(reg_query, [id])

        res.send(result.rows)
    } catch (err) {
        res.send(err.message)
    }
}

// single blog with details
export const getSingleBlogDetailsController = async(req, res)=>{
    try {
        const {id} = req.params
        const reg_query = `SELECT blogs.id, users.name as authorName, blogs.title, blogs.description FROM blogs INNER JOIN users ON users.id = blogs.author WHERE blogs.id=$1`

        const result = await dbconnect.query(reg_query, [id])

        res.send(result.rows)
    } catch (err) {
        res.send(err.message)
    }
}



export const getAllBlogController = async(req, res)=>{
    try {
        const reg_query = `SELECT * FROM blogs`

        const result = await dbconnect.query(reg_query)
        return res.send(result.rows)
    } catch (err) {
        return res.send(err.message)
    }
}


// INNER JOIN
export const getAllBlogDetailsController = async(req, res)=>{
    try {
        const reg_query = `SELECT blogs.id as blogid, title, description, name as author FROM blogs INNER JOIN users ON users.id = blogs.author`

        const result = await dbconnect.query(reg_query)
        return res.send(result.rows)
    } catch (err) {
        return res.send(err.message)
    }
}

export const updateBlogController = async(req, res)=>{
    try {
        const {id} = req.params
        const {title, description} = req.body

        let blog = await dbconnect.query(`SELECT * FROM blogs WHERE id = $1`, [id])

        let token = await decodedToken(req, res)

        if(token.id !== blog.rows[0].author){
            return res.send("user not found")
        }

        const update_query = `UPDATE blogs SET title = $1, description= $2 WHERE id = $3 AND author = $4 RETURNING *`
        const result = await dbconnect.query(update_query, [title, description, id, blog.rows[0].author])
        return res.send(result.rows)
    } catch (err) {
        return res.send(err.message)
    }
}
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
        const {blogId} = req.params
        const reg_query = `SELECT * FROM blogs WHERE id = $1`

        const result = await dbconnect.query(reg_query, [blogId])

        res.send(result.rows[0])
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
        const {blogId} = req.params

        const {title, description} = req.body

        let blog = await dbconnect.query(`SELECT * FROM blogs WHERE id = $1`, [blogId])

        const {id, email} = req.user
        
        if(id !== blog.rows[0].author){
            return res.send("user not found")
        }

        const update_query = `UPDATE blogs SET title = $1, description= $2 WHERE id = $3 AND author = $4 RETURNING *`
        const result = await dbconnect.query(update_query, [title, description, id, blog.rows[0].author])
        return res.send(result.rows)
    } catch (err) {
        return res.send(err.message)
    }
}

// Delete blog
export const deleteBlogController = async(req, res)=>{
    try {
        const {blogId} = req.params

        if(isNaN(blogId)){
            return res.status(400).json({success: false, message: "Invalid blog id"})
        }

        // find blog on db
        const findQuery = `SELECT id, author FROM blogs WHERE id= $1`
        const blog = await dbconnect.query(findQuery, [blogId])

        if(!blog.rows[0]){
            return res.status(404).json({success: false, message: "blog not found"})
        }

        if(blog.rows[0].author !== req.user.id && req.user.role !== "admin"){
            return res.status(403).json({success: false, message: "Forbidden"})
        }

        // delete blog if found on db
        const delQuery = `DELETE FROM blogs WHERE id=$1`
        await dbconnect.query(delQuery, [blog.rows[0].id])
        return res.status(200).json({success: true, message: "blog deletion succefull"})
    } catch (err) {
        return res.status(500).json({success: false, message: "Internal Server Error"})
    }
}

// Comments Controller
export const commentController = async(req, res)=>{
    try {
        const {comment_text} = req.body
        const {blogId} = req.params
        if(isNaN(blogId)){
            return res.status(400).json({success: false, message: "Invalid blog id"})
        }

        // find blog on db
        const findQuery = `SELECT id, author FROM blogs WHERE id= $1`
        const blog = await dbconnect.query(findQuery, [blogId])

        if(!blog.rows[0]){
            return res.status(404).json({success: false, message: "blog not found"})
        }
        console.log(req.users)
        // add comment into blog
        const commentQuery = `INSERT INTO coments (blog_id, user_id, comment_text) VALUES ($1, $2, $3)`
        await dbconnect.query(commentQuery, [blog.rows[0].id, req.users.id, comment_text])
        return res.status(200).json({success: true, message: "comment succefull"})
    } catch (err) {
        return res.status(500).json({success: false, message: "Internal Server Error"})
    }
}


// get all coments Controller
export const getAllCommentsController = async(req, res)=>{
    try {
        const {blogId} = req.params
        if(isNaN(blogId)){
            return res.status(400).json({success: false, message: "Invalid blog id"})
        }

        // find blog on db
        const findQuery = `SELECT id, author FROM blogs WHERE id= $1`
        const blog = await dbconnect.query(findQuery, [blogId])
        if(!blog.rows[0]){
            return res.status(404).json({success: false, message: "blog not found"})
        }

        // select all comments
        const commentReadQuery =   `SELECT users.name, users.email, comments.user_id, comments.comment_text FROM comments JOIN users ON users.id = comments.user_id WHERE comments.blog_id = $1`
        const result =  await dbconnect.query(commentReadQuery, [blog.rows[0].id])
        return res.status(200).json({success: true, message: "all comments here", totalComments: result.rows.length, data: result.rows})
    } catch (err) {
        return res.status(500).json({success: false, message: "Internal Server Error"})
    }
}
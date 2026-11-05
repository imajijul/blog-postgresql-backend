import express from "express"
import { commentController, createBloConroller, deleteBlogController, getAllBlogController, getAllCommentsController, getSingleBlogController, likeBlogController, updateBlogController} from "../controllers/blogController.js"
import {loginUserControler, registerUserController } from "../controllers/userController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { authorize } from "../middleware/authorize.js"
import upload from "../middleware/multer.js"

const router = express.Router()

// user routes
router.post("/register-user", registerUserController) // register user
router.post("/login", loginUserControler) // login user
// router.get("/logout", logoutController) // login user



// blog routes
router.post("/create-blog", upload.single('image'), authMiddleware, createBloConroller) // create blog
router.get("/blog/:blogId", getSingleBlogController) // read blog by id || single blog
router.get("/blogs", getAllBlogController) // read all blogs
router.put("/update-blog/:blogId", authMiddleware, updateBlogController) // update a blog 
router.delete("/blog/:blogId", authMiddleware, deleteBlogController)
router.post("/blog/:blogId/comment", authMiddleware, commentController)
router.get("/blog/:blogId/comments", getAllCommentsController)

// like route
router.post("/blog/:blogId/like", authMiddleware, likeBlogController)


export default router
import express from "express"
import { commentController, createBloConroller, deleteBlogController, getAllBlogController, getAllBlogDetailsController, getAllCommentsController, getSingleBlogController, getSingleBlogDetailsController, updateBlogController} from "../controllers/blogController.js"
import { accessRefreshController, loginUserControler, logoutController, registerUserController } from "../controllers/userController.js"
import { authMiddleware } from "../auth/authMiddleware.js"
import { authorize } from "../auth/authorize.js"

const router = express.Router()

// user routes
router.post("/register-user", registerUserController) // register user
router.get("/login", loginUserControler) // login user
router.get("/logout", logoutController) // login user



// blog routes
router.post("/create-blog", authMiddleware, createBloConroller) // create blog
router.get("/blog/:blogId", getSingleBlogController) // read blog by id || single blog
router.get("/blog-details/:blogId", getSingleBlogDetailsController) // read blog by id with details|| single blog
router.get("/blogs", getAllBlogController) // read all blogs
router.get("/blogs-detials", getAllBlogDetailsController) // read all blogs
router.put("/update-blog/:blogId", authMiddleware, updateBlogController) // update a blog 
router.delete("/blog/:blogId", authMiddleware, deleteBlogController)
router.post("/blog/:blogId/comment", authMiddleware, commentController)
router.get("/blog/:blogId/comments", getAllCommentsController)



// refresh token
router.get("/refresh-token", accessRefreshController)

export default router
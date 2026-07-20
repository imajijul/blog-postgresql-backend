export const authorize = (...roles)=>{
    return (req, res, next)=>{
        console.log(...roles)
        if(!roles.includes(req.user.role)){
            return res.status(401).json({success: false, message: 'Unauthorized'})
        }

        next()

    }
}
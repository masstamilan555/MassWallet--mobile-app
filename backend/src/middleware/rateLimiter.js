import ratelimit from "../config/upstash.js"

const ratelimiter = async(req,res,next)=>{
    try {
        const {success}=await ratelimit.limit("my-rate-limit")

        if(!success){
            return res.status(429).json({message:"Too many request, please try again later"})
        }
        next()
    } catch (err) {
        console.log(err);
        next(err)
        
    }
}

export default ratelimiter
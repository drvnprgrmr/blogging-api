const passport = require("passport")
const User = require("./models/user")

const JWTStrategy = require("passport-jwt").Strategy
const {
    fromAuthHeaderAsBearerToken, fromExtractors
} = require("passport-jwt").ExtractJwt


// Cookie extractor function
function fromCookie(req) {
    let token = null
    if (req.cookies) token = req.cookies["jwt"]
    return token
}

passport.use(new JWTStrategy(
    {
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest: fromExtractors([
            // Check for token in "Auth" header first
            fromAuthHeaderAsBearerToken(),
            // Check for token in browser cookies
            fromCookie
        ])
    },
    async (payload, done) => {
        // Retrieve the user's id from the payload
        let userId =  payload.id
        if (!userId) {
            const err = new Error("UserId is not included in token")
            err.status = 400
            return done(err)
        }
        const user = await User.findById(userId).exec()
        if (!user) {
            const err = new Error("User does not exist (maybe was deleted)")
            err.status = 404
            return done(err)
        }
        done(null, {id: userId})
    }
))



function authenticate(req, res, next) {
    passport.authenticate(
        "jwt", 
        {session: false}, 
        (err, user, info, status) => {
            // Return errors from jwt strategy
            if (err) return next(err)
            
            // Return other errors
            if (info) return next(info)

            // Attach the user to the request object
            req.user = user

            // Continue 
            next()
        }


    )(req, res, next)
}



module.exports = authenticate
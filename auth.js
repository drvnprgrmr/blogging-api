const passport = require("passport")
const User = require("./models/user")

const JWTStrategy = require("passport-jwt").Strategy
const ExtractJWT = require("passport-jwt").ExtractJwt


passport.use(new JWTStrategy(
    {
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    (payload, done) => {
        // Retrieve the user's id from the payload
        let userId =  payload.id
        if (!userId) {
            const err = new Error("UserId is not included in token")
            err.status = 400
            return done(err)
        }
        done(null, {id: payload.id})
    }
))



function authenticate(req, res, next) {
    passport.authenticate(
        "jwt", 
        {session: false}, 
        (err, user, info, status) => {
            console.log("Error => ", err)
            console.log("User => ", user)
            console.log("Info => ", info)
            console.log("Status => ", status)

            res.end()
        }


    )(req, res, next)
}




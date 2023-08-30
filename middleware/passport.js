const passportJWT = require('passport-jwt')
const JwtStrategy = passportJWT.Strategy
const ExtractJwt = passportJWT.ExtractJwt
const { User } = require('./../models/index')
const passport = require('passport')

require('dotenv').config()

module.exports = () => {
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromHeader('token'),
        secretOrKey: process.env.TOKEN,
      },
      (jwt_payload, done) => {
        console.log(jwt_payload)
        User.findOne({
          where: {
            id: jwt_payload.id,
          },
        })
          .then((data) => {
            return done(null, data)
          })
          .catch((err) => {
            return done(err, false)
          })
      }
    )
  )
}

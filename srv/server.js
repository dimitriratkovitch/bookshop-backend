const xsenv = require("@sap/xsenv")
const passport = require("passport")

var xsuaaCredentials
try {
    xsenv.loadEnv();
    const JWTStrategy = require("@sap/xssec").JWTStrategy
    const services = xsenv.getServices({ xsuaa: { tags: "xsuaa" } })
    xsuaaCredentials = services.xsuaa
    const jwtStrategy = new JWTStrategy(xsuaaCredentials)
    passport.use(jwtStrategy)
} catch (error) {
    console.warn(error.message)
}

cds.on('bootstrap', async (app) => {
    await app.use(passport.initialize())
    await app.use(
        passport.authenticate("JWT", { session: false })
    )
})


module.exports = cds.server // > delegate to default server.js
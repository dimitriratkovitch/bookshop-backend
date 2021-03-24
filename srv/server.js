const passport = require("passport");





// Middleware to read JWT sent by JobScheduler
function jwtLogger(req, res, next) {
  console.log("===> Binding: $XSAPPNAME: " + xsuaaCredentials.xsappname);
  console.log("===> Binding: clientid: " + xsuaaCredentials.clientid);
  console.log("===> Decoding JWT token sent by clientapp");
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const theJwtToken = authHeader.substring(7);
    if (theJwtToken) {
      const jwtBase64Encoded = theJwtToken.split(".")[1];
      const jwtDecoded = Buffer.from(jwtBase64Encoded, "base64").toString(
        "ascii"
      );
      const jwtJson = JSON.parse(jwtDecoded);
      console.log("==> JWT: Full");
      console.log(jwtJson);
      console.log("===> JWT: audiences: ");
      jwtJson.aud.forEach((entry) => console.log(`          -> ${entry}`));
      console.log("===> JWT: scopes: " + jwtJson.scope);
      console.log("===> JWT: authorities: " + jwtJson.authorities);
      console.log("===> JWT: client_id: " + jwtJson.client_id);
    }
  }
  next();
}

cds.on("bootstrap", async (app) => {

 // Authenticate in production only using JWT
  if (process.env.NODE_ENV === 'production') {
    await app.use(passport.initialize());
    await app.use(passport.authenticate("JWT", { session: false }));
  }
  // app.use(jwtLogger);
});

module.exports = cds.server; // > delegate to default server.js

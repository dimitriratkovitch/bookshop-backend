cds.on("bootstrap", async (app) => {
  // await app.use(passport.initialize());
  // await app.use(passport.authenticate("JWT", { session: false }));
});

module.exports = cds.server; // > delegate to default server.js

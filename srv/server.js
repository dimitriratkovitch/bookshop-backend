"use strict";

const passport = require("passport");
const cds = require("@sap/cds");
const proxy = require("@sap/cds-odata-v2-adapter-proxy");

cds.on("bootstrap", async function (app) {
    app.use(proxy());
    await app.use(passport.initialize());
    await app.use(passport.authenticate("JWT", { session: false }));
});

module.exports = cds.server; // > delegate to default server.js

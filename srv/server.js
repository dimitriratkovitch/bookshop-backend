cds.on("bootstrap", async (app) => {
  await app.get("/test", function (req, res) {
    res.status(200).json("OK");
  });
});

module.exports = cds.server; // > delegate to default server.js

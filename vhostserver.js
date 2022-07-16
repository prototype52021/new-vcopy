require("dotenv").config()
const vhost = require("vhost");

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

require("./config/db")();

const app = express();

app.use(cors());
app.use(express.json({ extended: false, limit: "250mb" }));
app.use(
  express.urlencoded({
    limit: "250mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.use(function (req, res, next) {
  console.log("request header", req.headers.host);
  if (!req.secure) {
    if (
      req.headers.host === `http://${process.env.LANDING_DOMAIN}` ||
      req.headers.host === `www${process.env.LANDING_DOMAIN}`
    ) {
      return res.redirect(`${process.env.LANDING}`);
    }
  }
  next();
});
/** app landing page configure */
const routerLanding = express.Router();
routerLanding.use(express.static(path.join("/pathtolanding/landing")));
routerLanding.get("*", function (req, res) {
  console.log("call download");
  return res.sendFile(
    path.join("/pathtolanding/landing", "index.html")
  );
});

app.use(vhost(process.env.LANDING_DOMAIN, routerLanding));
app.use(vhost(`www.${process.env.LANDING_DOMAIN}`, routerLanding));

/** the dashboard configure */
const { getZipFiles } = require("./api/v0.0.1/admin/getZipFiles");
const serverLanding = express.Router();
/** request all static data of specfic id as a zip file */
serverLanding.get("/getZipFiles", getZipFiles);
/** file listing request from dashboard */
serverLanding.get("/fileList",(req,res)=>{
    console.log("iam calling")
    res.sendFile("/home/backend-api/fileList/FileList.html")
  })
  serverLanding.get("/isAuthanticate", require("./middleware/auth"), (req, res) => {
    res.status(200).json({ msg: "you are authanticate" });
  })

serverLanding.use("/api", require("./api"));
/** dashboard path configure */
serverLanding.use(
  express.static(path.join("/home/backend-api/client-micro/build"))
);
serverLanding.get("*", function (req, res) {
  return res.sendFile(
    path.join("/home/backend-api/client-micro/build", "index.html")
  );
});


 app.use(vhost(process.env.SERVER_DOMAIN, serverLanding));
if (process.env == "production") {
  app.use(vhost(process.env.SERVER_DOMAIN, serverLanding));
} else {
//  app.use(serverLanding);
//  app.listen(3000, () => {
//    console.log("server run on 3000");
//  });
}
// require("./utils/updatePushScript");// use for latest app update push
module.exports = app;

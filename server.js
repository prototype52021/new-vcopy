"use strict";

var app = require("./vhostserver.js"); //if you want to configure multiple domain with same port please uncomment 

require("greenlock-express")
  .init({
    packageRoot: __dirname,
    configDir: "./greenlock.d",
    maintainerEmail: "drakeprototype@outlook.com",
    cluster: false,
  })
  // Serves on 80 and 443
  // Get's SSL certificates magically!
  .serve(app);



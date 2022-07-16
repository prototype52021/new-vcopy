const express = require("express");
const router = express.Router();

const Info = require("../../../models/Info");
const auth = require("../../../middleware/auth");
const IPInfo = require("../../../models/IPInfo");
const LiveInfo = require("../../../models/LiveInfos");

router.post("/", auth, async (req, res) => {
  try {
    let infoDB = await Info.find();

    let ipInfo = await Promise.all(
      infoDB.map(async (device) => {
        const address = await LiveInfo.findOne({
          $and: [{ imei: device.imei }, { "location.address": { $ne: "" } }],
        }).sort("-date");
        // console.log(address);
        return {
          ...device._doc,
          ipInfo: { ...(await IPInfo.findOne({ query: device.ipAddr }))._doc },
          address: { ...(address!=null ? address._doc : "N") },
        };
      })
    );

    res.status(200).json(ipInfo);
  } catch (e) {
    console.log("/api/v0.0.1/admin/getDevices.js (xinj-7)", e); //xinj-7
    res.status(500).send("/api/v0.0.1/admin/getDevices.js (xinj-8)"); //xinj-8
  }
});

module.exports = router;

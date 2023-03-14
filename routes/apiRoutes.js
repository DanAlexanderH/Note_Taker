const express = require("express");
const router = express.Router();
const util = require("util");
const fs = require("fs");
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

var ntsData;

router.get("/notes", (req, res) => {
    readFile("db/db.json", "utf8").then((data) => {
        ntsData = JSON.parse(data);
        console.log(ntsData);
        res.json(ntsData);
    });
});

router.post("/notes", (req, res) => {
    readFile("db/db.json", "utf8").then((data) => {
        ntsData = JSON.parse(data);

        let newNote = req.body;
        let ntID = ntsData.length;
        newNote.id = ntID + 1;

        ntsData.push(newNote);
        ntsData = JSON.stringify(ntsData);

        writeFile("db/db.json", ntsData).then((data) => {
            console.log("New Note has been added.");
            res.json(ntsData);
        });
        // res.json(ntsData);
    });
});


router.delete("/notes/:id", (req, res) => {
    let selectedID = parseInt(req.params.id);

    for(let i=0; i < ntsData.length; i++) {
        if(selectedID === ntsData[i].id) {
            ntsData.splice(i, 1);
            
            let note = JSON.stringify(ntsData, null, 2);

            writeFile("db/db.json", note).then((data) => {
                console.log("Note has been deleted");
            });
        }
    }
    res.json(ntsData);
});

module.exports = router;


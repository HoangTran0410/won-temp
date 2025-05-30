const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const STRING_FILE = path.join(__dirname, "string.txt");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve editor page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "editor.html"));
});

// API to get the string
app.get("/comein", (req, res) => {
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.set("Surrogate-Control", "no-store");

  fs.readFile(STRING_FILE, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading string");
    }
    res.send(data);
  });
});

// API to update the string
app.post("/update", (req, res) => {
  const { newString } = req.body;
  if (typeof newString !== "string") {
    return res.status(400).send("Invalid string");
  }
  fs.writeFile(STRING_FILE, newString, "utf8", (err) => {
    if (err) {
      return res.status(500).send("Error writing string");
    }
    res.send("String updated");
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

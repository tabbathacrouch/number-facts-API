/* Followed rapidAPI tutorial: https://rapidapi.com/blog/nodejs-express-rest-api-example/
 */
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const filePath = path.join(__dirname, "./facts.json");

// METHODS
// 1.) GET
const getFacts = async (req, res, next) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, "./facts.json"));
    const facts = JSON.parse(data);
    const numberFacts = facts.find(
      (x) => x.number === Number(req.params.number)
    );
    if (!numberFacts) {
      const err = new Error("Number Facts not found");
      err.status = 404;
      throw err;
    }
    res.json(numberFacts);
  } catch (e) {
    next(e);
  }
};
router.route("/api/v1/facts/:number").get(getFacts);

// 2.) POST
const createFacts = async (req, res, next) => {
  try {
    const data = fs.readFileSync(filePath);
    const facts = JSON.parse(data);
    const newFactsData = {
      number: req.body.number,
      facts_text: req.body.facts_text,
    };
    facts.push(newFactsData);
    fs.writeFileSync(filePath, JSON.stringify(facts));
    res.status(201).json(newFactsData);
  } catch (e) {
    next(e);
  }
};
router.route("/api/v1/facts").post(createFacts);

// 3.) PUT
const updateFacts = async (req, res, next) => {
  try {
    const data = fs.readFileSync(filePath);
    const facts = JSON.parse(data);
    const numberFacts = facts.find(
      (x) => x.number === Number(req.params.number)
    );
    if (!numberFacts) {
      const err = new Error("Number facts not found");
      err.status = 404;
      throw err;
    }
    const newFactsData = {
      number: req.body.number,
      facts_text: req.body.facts_text,
    };
    const newFacts = facts.map((x) => {
      if (x.number === Number(req.params.number)) {
        return newFactsData;
      } else {
        return x;
      }
    });
    fs.writeFileSync(filePath, JSON.stringify(newFacts));
    res.status(200).json(newFactsData);
  } catch (e) {
    next(e);
  }
};
router.route("/api/v1/facts/:number").get(getFacts).put(updateFacts);

// 4.) DELETE
const deleteFacts = async (req, res, next) => {
  try {
    const data = fs.readFileSync(filePath);
    const facts = JSON.parse(data);
    const numberFacts = facts.find(
      (x) => x.number === Number(req.params.number)
    );
    if (!numberFacts) {
      const err = new Error("Number facts not found");
      err.status = 404;
      throw err;
    }
    const newFacts = facts
      .map((x) => {
        if (x.number === Number(req.params.number)) {
          return null;
        } else {
          return x;
        }
      })
      .filter((number) => number !== null);
    fs.writeFileSync(filePath, JSON.stringify(newFacts));
    res.status(200).end();
  } catch (e) {
    next(e);
  }
};

router
  .route("/api/v1/facts/:number")
  .get(getFacts)
  .put(updateFacts)
  .delete(deleteFacts);

module.exports = router;

const express = require("express");
const router = express.Router();
const CrudController = require("../controllers/CrudController");

router.post("/:modelName", async (req, res) => {
  console.log("from crud route");
  try {
    const modelName = req.params.modelName;
    const Model = require(`../model/${modelName}`);
    await CrudController.create(Model, req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:modelName", async (req, res) => {
  try {
    const modelName = req.params.modelName;
    const Model = require(`../model/${modelName}`);

    // Extract query parameters
    const { sort, order, limit, filter } = req.query;

    // Create options object
    const options = {};

    // Add sorting to options if specified
    if (sort && order) {
      options.sort = {
        [sort]: order === "desc" ? -1 : 1,
      };
    }

    // Add limiting to options if specified
    if (limit) {
      options.limit = Number(limit);
    }

    // Add filtering to options if specified
    if (filter) {
      options.filter = JSON.parse(filter);
    }

    await CrudController.get(Model, options, req, res); // Pass options to the getAll function
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:modelName/:id", async (req, res) => {
  // console.log("from get by id: ", req.params.id);
  try {
    const modelName = req.params.modelName;
    const Model = require(`../model/${modelName}`);
    await CrudController.getById(Model, req, res); // Access the getById function through CrudController object
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" }); // Handle any potential errors
  }
});

router.put("/:modelName/:id", async (req, res) => {
  try {
    const modelName = req.params.modelName;
    const Model = require(`../model/${modelName}`);
    await CrudController.update(Model, req, res); // Access the update function through CrudController object
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" }); // Handle any potential errors
  }
});

router.delete("/:modelName/:id", async (req, res) => {
  console.log("From Route");
  try {
    const modelName = req.params.modelName;
    const Model = require(`../model/${modelName}`);
    await CrudController.remove(Model, req, res); // Access the remove function through CrudController object
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" }); // Handle any potential errors
  }
});

module.exports = router;

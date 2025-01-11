const create = async (Model, req, res) => {
  console.log("Model :", Model);
  try {
    const newItem = await Model.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error Creating new item", error);
    res.status(400).json({ error: error.message });
  }
};
const get = async (Model, options, req, res) => {
  try {
    let query = Model.find();

    // Apply filtering if specified
    if (options.filter) {
      query = query.find(options.filter);
    }

    // Apply sorting if specified
    if (req.query.sortField && req.query.sortOrder) {
      const sort = {};
      sort[req.query.sortField] = req.query.sortOrder === "asc" ? 1 : -1;
      query = query.sort(sort);
    }

    // Apply pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (Model.schema.paths.author) {
      query = query.populate("author");
    }
    const items = await query.exec();
    const totalItems = await Model.countDocuments(options.filter || {});

    res.status(200).json({ items, totalItems });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(400).json({ error: error.message });
  }
};

// const get = async (Model, options, req, res) => {
//   try {
//     let query = Model.find();

//     // Apply filtering if specified
//     if (options.filter) {
//       query = query.find(options.filter);
//     }

//     // Apply sorting if specified
//     if (options.sort) {
//       query = query.sort(options.sort);
//     }

//     // Apply limiting if specified
//     if (options.limit) {
//       query = query.limit(options.limit);
//     }
//     if (Model.schema.paths.author) {
//       query = query.populate("author");
//     }
//     const items = await query.exec();
//     res.status(200).json(items);
//   } catch (error) {
//     console.error("Error fetching items:", error);
//     res.status(400).json({ error: error.message });
//   }
// };
const getById = async (Model, req, res) => {
  try {
    const item = await Model.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const update = async (Model, req, res) => {
  // console.log("sssssss :", req.body);
  try {
    const updatedItem = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const remove = async (Model, req, res) => {
  console.log("From Controller ", req.params.id);
  try {
    const deletedItem = await Model.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getActiveDailyUsers = async (Model, req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today;
    const activeUsers = await Model.countDocuments({
      "connectionAttempts.lastAttemptDate": { $gte: today },
    });
    console.log("activeDaily: ", activeUsers);
    res.status(200).json({ activeDaily: activeUsers });
  } catch (error) {
    console.error("Error fetching active daily users:", error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  create,
  get,
  getById,
  update,
  remove,
  getActiveDailyUsers,
};

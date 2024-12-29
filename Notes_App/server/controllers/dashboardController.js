const mongoose = require("mongoose");
const Note = require("../model/Notes");

exports.dashboard = async (req, res, next) => {
  const perPage = 8;
  const page = req.query.page || 1;

  const locals = {
    title: "Dashboard",
    description: "free nodejs note app",
  };

  try {
    const notes = await Note.aggregate([
      { $sort: { createdAt: -1 } },
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $project: {
          title: { $substrBytes: ["$title", 0, 30] },
          body: { $substrBytes: ["$body", 0, 150] },
        },
      },
    ])
      .skip((page - 1) * perPage)
      .limit(perPage);

    const count = await Note.countDocuments({ user: req.user.id });

    res.render("dashboard/index", {
      userName: req.user.firstName,
      locals,
      notes,
      layout: "../views/layouts/dashboard",
      currentPage: page,
      totalPages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// view specific notes
exports.dashboardViewNote = async (req, res) => {
  const note = await Note.findById({ _id: req.params.id })
    .where({ user: req.user.id })
    .lean();

  if (note) {
    res.render("dashboard/View-Notes", {
      noteID: req.params.id,
      note,
      layout: "../views/layouts/dashboard",
    });
  } else {
    res.status(404).send("Note not found.");
  }
};

// update specific notes
exports.dashboardUpdateNote = async (req, res) => {
  try {
    await Note.findByIdAndUpdate(
      { _id: req.params.id },
      { title: req.body.title, body: req.body.body }
    ).where({ user: req.user.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

// delete specific notes
exports.dashboardDeleteNote = async (req, res) => {
  try {
    await Note.deleteOne({ _id: req.params.id }).where({ user: req.user.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};
// redirect to add note page
exports.dashboardAddNote = async (req, res) => {
  res.render("dashboard/Add", {
    layout: "../views/layouts/dashboard",
  });
};
// Add new notes
exports.dashboardAddNoteSubmit = async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Note.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

// search notes
exports.dashboardSearch = async (req, res) => {
  try {
    res.render("dashboard/search", {
      searchResults: "",
      layout: "../views/layouts/dashboard",
    });
  } catch (error) {
    console.log(error);
  }
};

// post (search results for notes)
exports.dashboardSearchSubmit = async (req, res) => {
  try {
    const searchTerm = req.body.searchTerm || "";

    const searchSanitized = searchTerm.replace(/[^a-zA-Z0-9\s]/g, "");

    console.log("Search Term: ", searchTerm);
    console.log("Sanitized Term: ", searchSanitized);

    const searchResults = await Note.find({
      $or: [
        { title: { $regex: new RegExp(searchSanitized, "i") } },
        { body: { $regex: new RegExp(searchSanitized, "i") } },
      ],
    }).where({ user: req.user.id });

    console.log("Search Results: ", searchResults);

    res.render("dashboard/search", {
      searchResults,
      layout: "../views/layouts/dashboard",
    });
  } catch (error) {
    console.error("Search Error: ", error);
    res.status(500).send("An error occurred while searching.");
  }
};

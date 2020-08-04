const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const validateId = require("../utils/validateId");

const Task = require("../models/task");

router.post("/task", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=0
//GET /tasks?sortBy=createdAt:desc

router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true"; 
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1: 1
  }

  try {
    //this one approach
    //const foundTasks = await Task.find({owner: req.user._id});
    //or this approach

    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort
        }
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  if (!validateId(_id)) {
    return res.status(401).json({
      error: `The provided id ${_id} is not valid`,
    });
  }

  try {
    const foundTask = await Task.findOne({ _id, owner: req.user._id });

    if (!foundTask) {
      return res.status(404).send();
    }
    res.status(200).send(foundTask);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];

  const isValidOperation = updates.every((item) => {
    return allowedUpdates.includes(item);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => {
      task[update] = req.body[update];
    });

    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const taskToDelete = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!taskToDelete) {
      return res.status(404).send();
    }

    res.send(taskToDelete);

    console.log(taskToDelete);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;

import express from "express";
import Project from "../models/Project.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects for a user
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id }).sort({
      updatedAt: -1,
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { title, language } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Please provide a title" });
    }

    const project = await Project.create({
      title,
      language: language || "javascript",
      owner: req.user.id,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check ownership
    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project (code, title, language)
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check ownership
    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check ownership
    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await project.deleteOne();
    res.json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;

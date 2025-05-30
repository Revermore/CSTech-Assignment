import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import Agent from "../models/Agent.js";

const router = express.Router();

// Create Agent (POST)
router.post("/", async (req, res) => {
  try {
    const { name, mobile, password, adminId } = req.body;

    const existingAgent = await Agent.findOne({ name });
    if (existingAgent) {
      return res.status(400).json({ message: "Agent already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const agent = await Agent.create({
      name,
      mobile,
      password: hashedPassword,
      createdBy: adminId,
    });

    res.status(201).json({ agent });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Agent Login (GET by name + password)
router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    const agent = await Agent.findOne({ name });
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, agent.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { name: agent.name, id: agent._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: agent, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Get all agents by adminId (GET)
router.get("/admin/:adminId", async (req, res) => {
  try {
    const agents = await Agent.find({ createdBy: req.params.adminId });
    res.status(200).json({ agents });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/", async (req, res) => {
  try {
    const agents = await Agent.find();
    res.status(200).json({ agents });
  } catch {
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;

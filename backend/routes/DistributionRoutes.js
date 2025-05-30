import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import Agent from "../models/Agent.js";
import Distribution from "../models/Distribution.js";
import File from "../models/File.js";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { fileID, startIndex, endIndex, agentID, adminID } = req.body;

    if (
      !fileID ||
      !agentID ||
      !adminID ||
      typeof startIndex !== "number" ||
      typeof endIndex !== "number"
    ) {
      return res.status(400).json({ message: "Missing or invalid fields" });
    }

    // Fetch the file to validate index range
    const file = await File.findById(fileID);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (endIndex >= file.data.length) {
      return res.status(400).json({
        message: `endIndex (${endIndex}) exceeds data length (${
          file.data.length - 1
        })`,
      });
    }

    if (startIndex > endIndex) {
      return res.status(400).json({
        message: "startIndex cannot be greater than endIndex",
      });
    }

    const distribution = await Distribution.create({
      file: fileID,
      agent: agentID,
      admin: adminID,
      startIndex,
      endIndex,
    });
    const agentName = await Agent.findById(agentID);
    res.status(201).json({
      message: "Distribution created",
      ...distribution,
      agentName: agentName.name,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create distribution",
      error: error.message,
    });
  }
});

router.get("/agent-files/:agentId", authenticateToken, async (req, res) => {
  try {
    const agentId = req.params.agentId;

    // First populate 'file' from Distribution, then inside 'file', populate 'uploadedBy'
    const distributions = await Distribution.find({ agent: agentId })
      .populate({
        path: "file",
        select: "filename data uploadedBy",
        populate: {
          path: "uploadedBy",
          model: "Admin",
          select: "username",
        },
      })
      .sort({ distributedAt: -1 });

    const result = distributions
      .map((dist) => {
        // Get the relevant data slice
        const slicedData = dist.file.data.slice(
          dist.startIndex,
          dist.endIndex + 1
        );

        // Filter out only entries with status "Processing"
        const filteredData = slicedData.filter(
          (entry) => entry.status === "Processing"
        );

        return {
          fileId: dist.file._id,
          filename: dist.file.filename,
          uploadedBy: dist.file.uploadedBy.username,
          startIndex: dist.startIndex,
          endIndex: dist.endIndex,
          data: filteredData,
        };
      })
      .filter((file) => file.data.length > 0); // Remove empty ones

    res.json({ assignedFiles: result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch agent files", error: error.message });
  }
});

router.get("/admin-files", async (req, res) => {
  try {
    const distributions = await Distribution.find()
      .populate("admin", "username")
      .populate("agent", "name")
      .populate("file");

    const detailedEntries = [];

    distributions.forEach((dist) => {
      const { file, admin, agent, startIndex, endIndex } = dist;
      const fileDataArray = file?.data || [];

      for (
        let i = startIndex;
        i <= endIndex && i <= fileDataArray.length;
        i++
      ) {
        const entry = fileDataArray[i];
        detailedEntries.push({
          index: i,
          filename: file.filename,
          uploadedBy: admin.username,
          uploadedAt: file.uploadedAt,
          agentName: agent.name,
          status: entry.status,
        });
      }
    });

    res.json({ entries: detailedEntries });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch file details",
      error: error.message,
    });
  }
});

export default router;

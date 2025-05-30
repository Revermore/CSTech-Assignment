import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import File from "../models/File.js";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  // router.post("/", async (req, res) => {
  try {
    const { originalName, fileType, data } = req.body;

    const file = await File.create({
      filename: `${Date.now()}_${originalName}`,
      originalName,
      fileType,
      data: data.map((item) => ({
        ...item,
        status: "Processing",
      })),
      uploadedBy: req.user.id,
    });

    res.status(201).json(file);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving file", error: error.message });
  }
});

router.put("/:id/status", authenticateToken, async (req, res) => {
  try {
    const { index, agentId } = req.body;

    const updatedFile = await File.findOneAndUpdate(
      {
        _id: req.params.id,
        "data._id": index,
      },
      {
        $set: {
          "data.$.status": "Completed",
          "data.$.processedAt": new Date(),
          "data.$.processedBy": agentId,
        },
      },
      { new: true }
    );

    if (!updatedFile) {
      return res.status(404).json({ message: "File or record not found" });
    }

    res.json(updatedFile);
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
});

router.get("/:id/data", authenticateToken, async (req, res) => {
  try {
    const { start = 0, end } = req.query;

    const file = await File.findById(req.params.id).select("data filename");
    if (!file) return res.status(404).json({ message: "File not found" });

    const endIndex = Math.min(
      Number(end || file.data.length - 1),
      file.data.length - 1
    );
    const slicedData = file.data.slice(Number(start), endIndex + 1);

    res.json({
      filename: file.filename,
      data: slicedData,
      total: file.data.length,
      uploadedBy: file.uploadedBy,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Data retrieval failed", error: error.message });
  }
});

router.post("/by-admin", async (req, res) => {
  try {
    const { adminID } = req.body;

    if (!adminID) {
      return res.status(400).json({ message: "adminID is required" });
    }

    const files = await File.find({ uploadedBy: adminID });

    res.json({ files });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

router.get("/", async(req,res)=>{
  try{
    const files = await File.find();
    res.json({files});
  }catch(error){
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
})

export default router;

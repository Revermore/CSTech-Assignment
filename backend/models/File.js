import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    unique: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    enum: ["csv", "xlsx", "xls"],
    required: true,
  },
  data: [
    {
      firstName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      notes: {
        type: String,
      },
      status: {
        type: String,
        enum: ["Processing", "Completed"],
        default: "Pending",
      },
      processedAt: Date,
      processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agent",
      },
    },
  ],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("File", FileSchema);

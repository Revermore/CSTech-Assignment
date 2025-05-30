import mongoose from "mongoose";

const AgentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  mobile: {
    countryCode: {
      type: String,
      required: true,
      default: "+1",
    },
    number: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{10,15}$/.test(v); // Basic mobile number validation
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
  },
  password: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Agent", AgentSchema);

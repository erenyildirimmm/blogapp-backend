import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      enique: true,
    },
    avatar: {
      type: String,
      default : "uploads/profiles/user.png"
    },
    role: {
      type: String,
      default: "user",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended", "Disabled"],
      default: "Active",
    },
    bio: {
      type: String,
      default: "I'm  new!",
    },
    socialMedia: {
      facebook: {
        type: String,
        default: "",
      },
      x: {
        type: String,
        default: "",
      },
      instagram: {
        type: String,
        default: "",
      },
      linkedin: {
        type: String,
        default: "",
      },
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);

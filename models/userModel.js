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
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user"
    },
    status: {
      type: String,
      default: "I'm  new!",
    },
    socialMedia: {
      facebook: {
        type: String,
        default: ""
      },
      x: {
        type: String,
        default: ""
      },
      instagram: {
        type: String,
        default: ""
      },
      linkedin: {
        type: String,
        default: ""
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

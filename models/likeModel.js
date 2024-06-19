import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    commendId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  {
    timestamps: true,
  }
);

export const Like = mongoose.model("Like", likeSchema);

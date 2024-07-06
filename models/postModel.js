import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      enique: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    entryHeadline: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: {
      type: Schema.Types.ObjectId,
      ref: "Like",
    },
  },
  {
    timestamps: true,
  }
);

postSchema.virtual("commentsCount", {
  ref: "Comment",
  localField: "_id",
  foreignField: "postId",
  count: true,
});

postSchema.virtual("likesCount", {
  ref: "Like",
  localField: "_id",
  foreignField: "postId",
  count: true,
});

postSchema.set("toJSON", { virtuals: true });
postSchema.set("toObject", { virtuals: true });

export const Post = mongoose.model("Post", postSchema);

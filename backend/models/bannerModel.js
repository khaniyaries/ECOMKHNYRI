import mongoose from "mongoose"

const bannerSchema = new mongoose.Schema({
  banners: {
    type: [
      {
        url: {
          type: String,
          required: true,
        },
        // Add responsive image URLs for different screen sizes
        responsiveUrls: {
          type: {
            mobile: String, // For small screens (< 768px)
            tablet: String, // For medium screens (768px - 1024px)
            desktop: String, // For large screens (> 1024px)
          },
          default: {},
        },
        index: {
          type: Number,
          unique: true,
          required: true,
        },
        linktitle: {
          type: String,
        },
        link: {
          type: String,
        },
        // Add dimensions for different screen sizes
        dimensions: {
          type: {
            mobile: {
              width: Number,
              height: Number,
            },
            tablet: {
              width: Number,
              height: Number,
            },
            desktop: {
              width: Number,
              height: Number,
            },
          },
          default: {
            mobile: { width: 300, height: 250 },
            tablet: { width: 728, height: 90 },
            desktop: { width: 970, height: 250 },
          },
        },
      },
    ],
  },
})

export const Banner = mongoose.model("banners", bannerSchema)
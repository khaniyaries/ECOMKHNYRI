import { Banner } from "../models/bannerModel.js"

export const updateBanner = async (req, res) => {
  try {
    const { index, url, responsiveUrls, linktitle, link, dimensions } = req.body

    if (index === undefined || index < 0) {
      return res.status(400).json({ message: "Invalid index" })
    }

    // Find the document that contains a banner with the given index
    const bannerData = await Banner.findOne({ "banners.index": index }).exec()

    if (!bannerData) {
      return res.status(404).json({ message: "Banner not found with the given index" })
    }

    // Construct the update query dynamically
    const updateQuery = {}
    if (url) updateQuery["banners.$.url"] = url
    if (responsiveUrls) updateQuery["banners.$.responsiveUrls"] = responsiveUrls
    if (linktitle) updateQuery["banners.$.linktitle"] = linktitle
    if (link) updateQuery["banners.$.link"] = link
    if (dimensions) updateQuery["banners.$.dimensions"] = dimensions

    // Update only the banner where `banners.index` matches
    const updatedBanner = await Banner.findOneAndUpdate(
      { "banners.index": index }, // Match the banner by its index field
      { $set: updateQuery }, // Update only the matched banner
      { new: true, runValidators: true },
    ).exec()

    res.status(200).json({ message: "Banner updated successfully", data: updatedBanner })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAllBanners = async (req, res) => {
  try {
    const bannerData = await Banner.findOne({}).exec()

    if (!bannerData || !bannerData.banners.length) {
      return res.status(404).json({ message: "No banners found" })
    }

    res.status(200).json({ message: "Success", banners: bannerData.banners })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const addbanner = async (req, res) => {
    try {
      const { url, responsiveUrls, index, linktitle, link, dimensions } = req.body
  
      let bannerData = await Banner.findOne({}).exec()
  
      if (!bannerData) {
        bannerData = await Banner.create({ banners: [] })
      }
  
      const indexExists = bannerData.banners.some((banner) => banner.index === index)
      if (indexExists) {
        return res.status(400).json({ message: "Order already exists. Choose a unique index." })
      }
  
      const updatedBanner = await Banner.findOneAndUpdate(
        {},
        {
          $push: {
            banners: {
              url,
              responsiveUrls: responsiveUrls || {},
              index,
              linktitle,
              link,
              dimensions: dimensions || {
                mobile: { width: 300, height: 250 },
                tablet: { width: 728, height: 90 },
                desktop: { width: 970, height: 250 },
              },
            },
          },
        },
        { new: true, runValidators: true },
      ).exec()
  
      res.status(200).json({ message: "Banner added successfully", data: updatedBanner })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

// New function to reorder banners
export const reorderBanners = async (req, res) => {
  try {
    const { bannerOrder } = req.body

    if (!Array.isArray(bannerOrder)) {
      return res.status(400).json({ message: "bannerOrder must be an array" })
    }

    // Get current banners
    const bannerData = await Banner.findOne({}).exec()

    if (!bannerData) {
      return res.status(404).json({ message: "No banners found" })
    }

    // Update each banner's index based on the new order
    const updatePromises = bannerOrder.map(async (item, newIndex) => {
      return Banner.updateOne({ "banners.index": item.oldIndex }, { $set: { "banners.$.index": newIndex + 1 } })
    })

    await Promise.all(updatePromises)

    // Get updated banners
    const updatedBannerData = await Banner.findOne({}).exec()

    res.status(200).json({
      message: "Banners reordered successfully",
      banners: updatedBannerData.banners,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteBanner = async (req, res) => {
    try {
        const { index } = req.params

        const result = await Banner.findOneAndUpdate(
        {},
        { $pull: { banners: { index: parseInt(index) } } },
        { new: true }
        )

        if (!result) {
        return res.status(404).json({ message: "Banner not found" })
        }

        // Reorder remaining banners
        const updatedBanners = result.banners.map((banner, idx) => ({
        ...banner.toObject(),
        index: idx + 1
        }))

        await Banner.findOneAndUpdate(
        {},
        { $set: { banners: updatedBanners } },
        { new: true }
        )

        res.status(200).json({ message: "Banner deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
import { Banner } from "../models/bannerModel.js"
export const updateBanner = async (req, res) => {
    try {
        const { index, url, linktitle, link } = req.body;

        if (index === undefined || index < 0) {
            return res.status(400).json({ message: "Invalid index" });
        }

        // Find the document that contains a banner with the given index
        const bannerData = await Banner.findOne({ "banners.index": index }).exec();

        if (!bannerData) {
            return res.status(404).json({ message: "Banner not found with the given index" });
        }

        // Construct the update query dynamically
        const updateQuery = {};
        if (url) updateQuery["banners.$.url"] = url;
        if (linktitle) updateQuery["banners.$.linktitle"] = linktitle;
        if (link) updateQuery["banners.$.link"] = link;

        // Update only the banner where `banners.index` matches
        const updatedBanner = await Banner.findOneAndUpdate(
            { "banners.index": index },  // Match the banner by its index field
            { $set: updateQuery },       // Update only the matched banner
            { new: true, runValidators: true }
        ).exec();

        res.status(200).json({ message: "Banner updated successfully", data: updatedBanner });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getAllBanners = async (req, res) => {
    try {
        const bannerData = await Banner.findOne({}).exec();

        if (!bannerData || !bannerData.banners.length) {
            return res.status(404).json({ message: "No banners found" });
        }

        res.status(200).json({ message: "Success", banners: bannerData.banners });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const addbanner = async (req, res) => {
    try {
        const { url,index, linktitle, link } = req.body;

        // Find the document
        let bannerData = await Banner.findOne({}).exec();

        // If document doesn't exist, create one
        if (!bannerData) {
            bannerData = await Banner.create({ banners: [] });
        }

        // Check if banners array exists and its length
        if (bannerData.banners.length >= 5) {
            return res.status(400).json({ message: "Maximum of 5 banners reached" });
        }
        
        const indexExists = bannerData.banners.some(banner => banner.index === index);
        if (indexExists) {
            return res.status(400).json({ message: "order already exists. Choose a unique index." });
        }

        // Add new banner data
        const updatedBanner = await Banner.findOneAndUpdate(
            {},
            { $push: { banners: { url,index, linktitle, link } } }, 
            { new: true, runValidators: true }
        ).exec();

        res.status(200).json({ message: "Banner added successfully", data: updatedBanner });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



// export const addbanner = async (req, res) => {
//     try {
//         const { url, index } = req.body;
//         const d=await  Banner.findOne(
//             {},
//         ).exec()
//         if (data.banners.length > 5) {
//             throw new Error("maximum of 5 banners reached")
//             return
//         }
//         const data = await Banner.findOneAndUpdate(
//             {},
//             { $push: { banners: { url: url, index: index } } },
//             { new: true, runValidators: true },
//         ).exec()

        
//         res.status(200).json({ message: "ok", data })
//     } catch (error) {
//         res.status(400).json({ message: error.message })
//     }
// }
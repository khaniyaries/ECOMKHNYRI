import { adminModel } from "../models/adminModel.js";

export const adminLogin = async (req, res) => {
    console.log('Received request body:', req.body);
    const { username, password } = req.body;

    console.log('Collection being queried:', adminModel.collection.name);
    console.log('Query criteria:', { username: req.body.username });
    
    if (!username || !password) {
        return res.status(400).json({ message: "Please enter admin credentials", success: false });
    }

    console.log('Received request body:', req.body);
    console.log('Querying collection:', adminModel.collection.name);

    const adminExist = await adminModel.findOne({ username });
    console.log('Database result:', adminExist);
    if (!adminExist) {
        return res.status(400).json({ message: "Enter correct details", success: false });
    }

    if (password !== adminExist.password) {
        return res.status(400).json({ message: "Incorrect password", success: false });
    }
      
    return res.status(200).json({ success: true, message: "Admin login success" });
};

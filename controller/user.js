import USER from '../schema/user.js';
import { createToken } from "../tokenCreation_and_Validations.js";

export const handleUserSignup = async (req, res) => {
const { name, email, password } = req.body;

if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
}
try {
    await USER.create({ name, email, password });
    return res.status(201).json({ success: true, message: "User created successfully" });
} catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
}
}

export const handleUserLogin = async (req, res) => {
const { email, password } = req.body;
try {
    const user = await USER.findOne({ email, password });
    if (!user) {
        return res.status(401).json({ success: false, error: "Invalid email or password" });
    }
    const token = createToken(user);
    res.cookie('gfgauthToken', token, {
        httpOnly: true,      
      sameSite: "None",    
      secure: true,   
        maxAge: 3600000 
    });
    return res.status(200).json({ success: true, message: "Login successful" });
} catch (error) {
    console.error("Error during user login:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
}
}


export const handleUserLogout = (req, res) => {
    res.clearCookie('gfgauthToken', {
        httpOnly: true,      
      sameSite: "None",    
      secure: true,
      maxAge: 3600000   
    });
    return res.status(200).json({ success: true, message: "Logout successful" });
}
import { Request, Response } from "express";
import User from "../models/User"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    try {

        // Check whether the user already exits with the same email or not
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create new user entity
        const user = new User({ name, email, passwordHash, role: "customer" });
        await user.save();

        res.json({ msg: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Check whether the user exits or not
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });
        
        // Compate user input password with hashed password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
        
        res.status(200).json({ user, token });

    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err });
    }
};

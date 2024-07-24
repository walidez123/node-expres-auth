import User from "../models/user.js";
import Role from "../models/roles.js";
import JWT from "jsonwebtoken";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
export const GetAllUsers = async(req,res)=>{
    const users = await User.find();
    if(!users){
        return res.status(404).json({ msg: "No users found" });
    }
    res.json(users);

}


export const Register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the email already exists
        let exist = await User.findOne({ email });
        if (exist) {
            return res.status(400).json({ msg: "Email already exists" });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Find the default "user" role
        const defaultRole = await Role.findOne({ title: 'user' });
        if (!defaultRole) {
            return res.status(500).json({ msg: "Default role not found" });
        }

        // Create a new user with the hashed password and default role
        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword,
            roles: [defaultRole._id] // Assign default "user" role
        });
        await newUser.save();

        // Generate a JWT token with user ID, email, and role
        const token = JWT.sign(
            { _id: newUser._id, email: newUser.email, role: defaultRole._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' } // Token expiration time
        );

        // Send the new user and token as response
        return res.status(201).json({ user: newUser, token });

    } catch (error) {
        // Handle server errors
        console.error("Server Error: ", error);
        return res.status(500).json({ msg: "Server Error" });
    }
};

export const Login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the email exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'Email not found' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid password' });
        }

        // Generate a JWT token with user ID and email
        const token = JWT.sign(
            { _id: user._id, email: user.email ,role:user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' } // Token expiration time
        );

        // Send the user and token as response
        return res.status(200).json({ user, token });

    } catch (error) {
        // Handle server errors
        console.error("Server Error: ", error);
        return res.status(500).json({ msg: "Server Error" });
    }
};

export const assignRolesToUser = async (req, res) => {
    const {  roles } = req.body;
    const id = req.params.id;
    try {
        const roleIds = await Role.find({ title: { $in: roles } }).select('_id');
        const user = await User.findByIdAndUpdate(id, { roles: roleIds }, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log(roleIds)
        res.status(200).json({ message: "Roles assigned successfully", data: user });
    } catch (error) {
        res.status(500).json({ message: "Failed to assign roles", error });
    }
};

export const DeleteUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        return res.status(200).json({ msg: "User deleted successfully" });

    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ msg: "Server Error" });
    }
};
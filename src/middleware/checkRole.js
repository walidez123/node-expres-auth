import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import Permission from "../models/permission.js"
dotenv.config();

export const CheckRole = () => {
    return async (req, res, next) => {
        const authHeader = req.headers.authorization;
        const route = req.originalUrl
        if (!authHeader) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        const token = authHeader.split(' ')[1];

        try {
            // Verify token
            const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);
            req.user = decoded;

            // Fetch user from the database to get roles
            const user = await User.findById(req.user.id).populate('roles');
            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }

            // Fetch permissions for the route
            const permission = await Permission.findOne({ route }).populate('roles');
            if (!permission) {
                return res.status(403).json({ msg: 'No permission found for this route' });
            }

            // Check if user has at least one role that matches the permission's roles
            const userRoleIds = user.roles.map(role => role._id.toString());
            const hasPermission = permission.roles.some(roleId => userRoleIds.includes(roleId.toString()));
            if (!hasPermission) {
                return res.status(403).json({ msg: 'Access denied you dont have accsess to this route' });
            }

            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ msg: 'Invalid token' });
        }
    };
};

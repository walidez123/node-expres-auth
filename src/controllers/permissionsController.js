import Permission from "../models/permission.js";
import Role from "../models/roles.js";

export const getAllPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find();
        res.status(200).json(permissions);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch permissions', error });
    }
}

export const createPermission = async (req, res) => {
    const { route, roles } = req.body;

    try {
        let exist = await Permission.findOne({ route });

        if (exist) {
            exist.roles = roles;
            exist = await exist.save();
            return res.status(200).json(exist);
        }

        const roleIds = await Role.find({ title: { $in: roles } }).select('_id');

        const newPermission = new Permission({
            route,
            roles: roleIds.map(role => role._id)
        });

        await newPermission.save();
        res.status(201).json({ message: "Permission created successfully", data: newPermission });
    } catch (error) {
        res.status(500).json({ message: "Failed to create permission", error });
    }
}

export const deletePermissionById = async (req, res) => {
    try {
        const permission = await Permission.findByIdAndDelete(req.params.id);

        if (!permission) {
            return res.status(404).send({ message: "Permission not found." });
        }
        res.send({ message: "Permission deleted successfully!" });
    } catch (err) {
        res.status(500).send({ message: "Could not delete permission." });
    }
}

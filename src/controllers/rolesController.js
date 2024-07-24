import Role from "../models/roles.js"


export const CreateRole = async (req, res) => {
    const { title } = req.body;

    try {
        const newRole = new Role({ title });
        await newRole.save();
        return res.status(201).json({ message: "Role created successfully", data: newRole });
    } catch (error) {
        console.error("Failed to create role:", error);
        return res.status(500).json({ message: "Failed to create role" });
    }
};

export const GetAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        return res.json({ message: "Roles fetched successfully", data: roles });
    } catch (error) {
        console.error("Failed to fetch roles:", error);
        return res.status(500).json({ message: "Failed to fetch roles" });
    }
};

export const DeleteRole = (req, res) => {
    Role.findByIdAndDelete(req.params.id)
       .then(role => {
            if (!role)
                return res.status(404).send({ message: "Role not found." });
            res.send({ message: "Role deleted successfully!" });
        })
       .catch(err => {
            res.status(500).send({ message: "Could not delete role." });
        });
}
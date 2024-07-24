// models/permissions.js
import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
    route: {
        type: String,
        required: true,
        unique: true
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }]
});

export default mongoose.model('Permission', permissionSchema);

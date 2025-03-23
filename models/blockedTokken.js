import mongoose from 'mongoose';

const { Schema } = mongoose;

const blockedTokenSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400
    }
});

const BlockedToken = mongoose.model('BlockedToken', blockedTokenSchema);

export default BlockedToken;
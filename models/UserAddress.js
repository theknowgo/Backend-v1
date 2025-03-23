import mongoose from 'mongoose';

const userAddressSchema = new mongoose.Schema({
    addressId: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString(),
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    address: {
        type: String,
        required: true
    }
});

const UserAddress = mongoose.model('UserAddress', userAddressSchema);

export default UserAddress;

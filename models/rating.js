import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
    partnerId: { // Changed from localmateId
        type: String,
        required: true,
        ref: 'User'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Rating = mongoose.model('Rating', ratingSchema);
export default Rating;
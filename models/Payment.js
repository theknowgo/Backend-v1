import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    PaymentId: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString(),
        unique: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    thirdPartyPaymentId: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: true
    }
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;

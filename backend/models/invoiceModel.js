import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
    senderName: {
        type: String,
        required: true,
    },
    senderAddress: {
        type: String,
        required: true,
    },
    receiverName: {
        type: String,
        required: true,
    },
    receiverAddress: {
        type: String,
        required: true,
    },
    invoiceId: {
        type: Number,
        required: true,
    },
    issuedOn: {
        type: Date,
        required: true,
    },
    dueOn: {
        type: Date,
        required: true,
    },
    paidOn: {
        type: Date,
        required: true,
    },
    items: {
        type: [],
        required: true,
        default: [],
    },
    grandTotal: {
        type: Number,
        required: true,
    },
}, { timestamps: true })

const Invoice = mongoose.model("Invoice", InvoiceSchema);
export default Invoice;
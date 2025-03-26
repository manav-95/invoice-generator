import Invoice from "../models/invoiceModel.js";

export const createInvoice = async (req, res) => {
    try {
        const { senderName, senderAddress, receiverName, receiverAddress, paidOn, items, issuedOn, invoiceId, grandTotal, dueOn } = req.body;

        // Check if all fields are provided
        if (!senderName || !senderAddress || !receiverName || !receiverAddress || !paidOn || !items || !issuedOn || !invoiceId || !grandTotal || !dueOn) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newInvoice = new Invoice({
            senderName,
            senderAddress,
            receiverName,
            receiverAddress,
            paidOn,
            items,
            issuedOn,
            invoiceId,
            grandTotal,
            dueOn
        });

        await newInvoice.save();
        console.log("New Invoice: ", newInvoice)

        return res.status(201).json({ message: "Invoice Created Successfully" });
    } catch (error) {
        console.error("Error Creating Invoice: ", error.message);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};


export const helloWorld = async (req, res) => {
    try {
        return res.json("Hello ")
    } catch (error) {

    }
}


export const getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find();

        if (invoices.length === 0) {
            return res.status(404).json({ message: "No Invoices Found" });
        }

        return res.status(200).json({
            message: "Invoices Fetched Successfully",
            invoices, // Sending the data inside the response
        });
    } catch (error) {
        console.error("Error Fetching Invoices:", error.message);
        return res.status(500).json({ message: "Server Error" });
    }
};


export const getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).json({ message: "Invoice id Not Found" })
        }
        const invoice = await Invoice.findById(id);
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not Found" })
        }
        return res.status(200).json({
            message: "Invoice Successfully Found by id",
            invoice,
        })
    } catch (error) {
        console.error("Error Fetching Invoice:", error.message);
        return res.status(500).json({ message: "Server Error" });
    }
}


export const deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params
        const deletedInvoice = await Invoice.findByIdAndDelete(id);
        if (!deletedInvoice) return res.status(404).json({ message: "Invoice not found" });
        res.json({ message: "Invoice deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

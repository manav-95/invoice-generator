import express from "express"
import { createInvoice, helloWorld, getAllInvoices, getInvoiceById, deleteInvoice } from "../controllers/invoiceController.js";

const router = express.Router();

router.post('/createInvoice', createInvoice);
router.get('/hello', helloWorld)
router.get('/', getAllInvoices);
router.get('/:id', getInvoiceById);
router.delete('/:id', deleteInvoice);

export default router;
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IndianRupee } from "lucide-react";

interface Invoice {
    _id: string;
    invoiceId: number;
    senderName: string;
    receiverName: string;
    grandTotal: number;
    issuedOn: string;
}

const InvoiceList = () => {

    const navigate = useNavigate();

    const baseURL = import.meta.env.VITE_APP_BACKEND_BASE_URL;

    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/invoices`);
                console.log(response.data); // Debugging log

                if (response.data.invoices) {
                    setInvoices(response.data.invoices);
                } else {
                    setInvoices([]); // Ensure it's an array
                }
            } catch (err: any) {
                console.error("Error fetching invoices:", err);

            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this invoice?")
        if (!confirmDelete) return;

        try {
            await axios.delete(`${baseURL}/api/invoices/${id}`);
            setInvoices((prevInvoices) => prevInvoices.filter((invoice) => invoice._id !== id));
            alert("Invoice Deleted Successfully")
        } catch (error) {
            console.error("Error deleting invoice:", error);
            alert("Failed to delete invoice.");
        }
    }

    if (loading) return <p>Loading...</p>;


    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Invoices</h2>

                <div className="overflow-x-auto p-4 bg-white rounded shadow">
                    <table className="w-full border border-gray-200 rounded overflow-hidden">
                        <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                            <tr>
                                <th className="p-4 text-left">Invoice ID</th>
                                <th className="p-4 text-left">Sender Name</th>
                                <th className="p-4 text-left">Receiver Name</th>
                                <th className="p-4 text-center">Amount</th>
                                <th className="p-4 text-center">Issued Date</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {invoices.length > 0 ? (
                                invoices.map((invoice, index) => (
                                    <tr
                                        key={invoice._id}
                                        className={`text-gray-800 text-sm ${index % 2 === 0 ? "bg-white" : "bg-slate-50"} `}
                                    >
                                        <td className="p-4 font-semibold"># {invoice.invoiceId}</td>
                                        <td className="p-4">{invoice.senderName}</td>
                                        <td className="p-4">{invoice.receiverName}</td>
                                        <td className="p-4 text-left font-semibold text-green-600">
                                            <div className="flex justify-center items-center">
                                                <IndianRupee className="h-4 w-4" />
                                                <span>
                                                    {invoice.grandTotal.toFixed(2)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center text-gray-600">{new Date(invoice.issuedOn).toLocaleDateString()}</td>

                                        <td className="p-4 text-center space-x-2">
                                            <button
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded shadow-md transition-all"
                                                onClick={() => navigate(`/invoice/${invoice._id}`)}
                                            >
                                                View
                                            </button>
                                            <button
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow-md transition-all"
                                                onClick={() => handleDelete(invoice._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center p-4 text-lg text-red-500">
                                        No Invoices Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>


            </div>
        </div>

    );
};

export default InvoiceList;

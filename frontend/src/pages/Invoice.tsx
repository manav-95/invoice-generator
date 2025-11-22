import axios from "axios"
import { CircleCheckBig, IndianRupee } from "lucide-react";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"


import printJS from "print-js";


interface Invoice {
    _id: string;
    senderName: string;
    senderAddress: string;
    receiverName: string;
    receiverAddress: string;
    grandTotal: number;
    invoiceId: number;
    issuedOn: Date;
    paidOn: Date;
    dueOn: Date;
    items: any[];
}

interface InvoiceItems {
    id: number;
    description: string;
    amount: number;
    quantity: number;
    total: number;
}

const Invoice = () => {
    const { id } = useParams();

    const [invoice, setInvoice] = useState<Invoice | null>(null)
    const [invoiceItems, setInvoiceItems] = useState<InvoiceItems[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    const baseURL = import.meta.env.VITE_APP_BACKEND_BASE_URL;

    let printDate = new Date();


    useEffect(() => {
        const fetchInvoiceDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${baseURL}/api/invoices/${id}`);

                if (response.data.invoice) {
                    console.log("Fetched Invoice:", response.data.invoice);
                    setInvoice(response.data.invoice);
                    console.log(response.data.invoice.items)
                    setInvoiceItems(response.data.invoice.items)
                } else {
                    setError("No invoice found.");
                }
            } catch (error: any) {
                console.error("Error fetching invoice:", error.message);
                setError("Failed to fetch invoice details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchInvoiceDetails();
    }, [id]);



    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    if (!invoice) return <p>No invoice found.</p>;


    const handlePrint = () => {
        printJS({
            printable: "invoice-content",
            type: "html",
            documentTitle: `invoice_${invoice.invoiceId}`,
            scanStyles: false,
            css: "/src/index.css",
            style: `
                @page {
                    size: A0;
                    margin: 0; /* Ensure no extra margin */
                }
    
                @media print {
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
    
                    body {
                        background-color: white !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
    
                    /* Hide default browser header/footer */
                    @page {
                        margin: 8mm; /* Adjust if needed */
                    }
    
                    /* Hide manually added header/footer */
                    header, footer {
                        display: none !important;
                        visibility: hidden !important;
                    }
    
                    /* Remove any browser-injected content */
                    body::before, body::after {
                        content: none !important;
                        display: none !important;
                    }
                }
            `,
        });
    };

    const title = `invoice_${invoice.invoiceId}`


    return (
        <div className="max-w-5xl mx-auto my-auto h-screen flex flex-col justify-center">
           
            <div id="invoice-content" className="border p-4 tracking-wide">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-2xl font-medium">Invoice #{invoice.invoiceId}</h1>
                    <span className="text-sm">{printDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center justify-start py-3 px-4 bg-green-300/20 border-b-[3.5px] border-green-500">
                    <CircleCheckBig className="h-5 w-5 flex-shrink-0 mr-3 mt-0.5 text-green-600" />
                    <span>Invoice paid on {invoice.paidOn
                        ? new Date(invoice.paidOn).toLocaleDateString('en-US', {
                            month: 'long',
                            day: '2-digit',
                            year: 'numeric'
                        })
                        : 'Not Set'}
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-8 my-4">
                    <div className="flex flex-col">
                        <span className="text-sm">Issued on</span>
                        <span className="text-base font-medium">
                            {invoice.issuedOn
                                ? new Date(invoice.issuedOn).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: '2-digit',
                                    year: 'numeric'
                                })
                                : 'Not Set'}
                        </span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm">Due on</span>
                        <span className="text-base font-medium">
                            {invoice.dueOn
                                ? new Date(invoice.dueOn).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: '2-digit',
                                    year: 'numeric'
                                })
                                : 'Not Set'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 my-4">
                    <div className="flex flex-col">
                        <span className="text-sm">From</span>
                        <div className="flex flex-col">
                            <span className="text-base font-medium break-words capitalize">
                                {invoice.senderName}
                            </span>
                            <span className="text-sm break-words max-w-80 text-gray-500">
                                {invoice.senderAddress}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm">To</span>
                        <div className="flex flex-col">
                            <span className="text-base font-medium break-words capitalize">
                                {invoice.receiverName}
                            </span>
                            <span className="text-sm break-words  max-w-80 text-gray-500">
                                {invoice.receiverAddress}
                            </span>
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-2 gap-8 my-4">
                    <div className="flex flex-col">
                        <span className="text-sm">Paid On</span>
                        <span className="text-base font-medium">
                            {invoice.paidOn
                                ? new Date(invoice.paidOn).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: '2-digit',
                                    year: 'numeric'
                                })
                                : 'Not Set'}
                        </span>
                    </div>
                </div>



                <div className="rounded px-0 py-2">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold">Items</h2>
                    </div>

                    <div className="border rounded px-1.5 py-1.5 h-full">
                        <table className="w-full h-full border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 text-left">Description</th>
                                    <th className="py-2 px-4 text-center">Amount</th>
                                    <th className="py-2 px-4 text-center">Quantity</th>
                                    <th className="py-2 px-4 text-right">Total</th>
                                </tr>
                            </thead>

                            <tbody>
                                {invoiceItems && (
                                    invoiceItems.map((item) => (
                                        <tr key={item.id} className="border-b">
                                            {/* Description */}
                                            <td className="py-2 px-4 break-words max-w-40">
                                                {item.description}
                                            </td>

                                            {/* Amount */}
                                            <td className="py-2 px-4 text-center">
                                                <div className="flex items-center justify-center">
                                                    <span className="mr-1"><IndianRupee className="h-4 w-4" /></span>
                                                    <span>{item.amount}</span>
                                                </div>
                                            </td>

                                            {/* Quantity */}
                                            <td className="py-2 px-4 text-center">
                                                <span>{item.quantity}</span>
                                            </td>

                                            {/* Total */}
                                            <td className="py-2 px-4 font-medium text-right">
                                                <div className="flex items-center justify-end">
                                                    <IndianRupee className="h-4 w-4" />
                                                    <span>{item.total}</span>
                                                </div>
                                            </td>

                                        </tr>
                                    ))
                                )}
                            </tbody>

                            <tfoot className="">
                                <tr className="">
                                    <td colSpan={3} className="font-bold px-4 py-2">
                                        Total
                                    </td>
                                    <td className="font-bold text-right px-4 py-2 flex justify-end items-center"><IndianRupee className="h-4 w-4" />{invoice.grandTotal}</td>

                                </tr>
                            </tfoot>

                        </table>

                    </div>

                </div>

            </div>

            <div className="w-full flex justify-end mt-3">
                <button onClick={handlePrint} className="py-2 px-12 rounded-xs bg-blue-500/85 text-white">Print</button>
            </div>
        </div>
    )
}

export default Invoice
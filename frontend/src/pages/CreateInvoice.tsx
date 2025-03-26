import axios from "axios";
import { IndianRupee, Trash2 } from "lucide-react";
import React, { useState } from "react";
import printJS from "print-js";

interface Item {
  id: string
  description: string
  amount: number
  quantity: number
  total: any
}

const CreateInvoice = () => {

  const handlePrint = () => {
    printJS({
      printable: "invoice-content",
      type: "html",
      scanStyles: false, // Prevents automatic style scanning
      css: "/src/index.css", // <-- Ensure Tailwind styles are included
      style: `
      @media print {
          * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
          }

          body {
              background-color: white !important;
          }

          
  `,
    });
  };

  const baseURL = import.meta.env.VITE_APP_BACKEND_BASE_URL;

  const [items, setItems] = useState<Item[]>([
    {
      id: Date.now().toString(),
      description: "",
      amount: 0,
      quantity: 1,
      total: 0,
    }
  ])



  const [formData, setFormData] = useState({
    senderName: "",
    senderAddress: "",
    receiverName: "",
    receiverAddress: "",
    issuedOn: "",
    dueOn: "",
    paidOn: "",
    items: [] as Item[],
  });

  const [error, setError] = useState({
    senderName: "",
    senderAddress: "",
    receiverName: "",
    receiverAddress: "",
    issuedOn: "",
    dueOn: "",
    paidOn: "",
    items: "",
    description: "",
    amount: "",

  });

  const addItem = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newItem: Item = {
      id: Date.now().toString(),
      description: "",
      amount: 0,
      quantity: 1,
      total: 0,
    }
    setItems((prevItems) => [...prevItems, newItem])

    console.log("Updated Items:", items) // Debugging line
  }


  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const clearAll = (e: any) => {
    e.preventDefault();
    setItems([
      {
        id: "",
        description: "",
        amount: 0,
        quantity: 1,
        total: 0,
      },
    ]);
  };



  const updateItem = (id: string, field: keyof Item, value: string | number) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id === id) {
          const newItem = { ...item, [field]: value };

          // ✅ Ensure the total updates correctly
          if (field === "amount" || field === "quantity") {
            newItem.total = Number(newItem.amount) * Number(newItem.quantity);
          }
          return newItem;
        }
        return item;
      });

      setFormData((prev) => ({
        ...prev,
        items: updatedItems.map(item => ({
          ...item,  // ✅ Ensure all fields, including `id`, are included properly
        })),
        grandTotal: updatedItems.reduce((sum, item) => sum + item.total, 0), // ✅ Recalculate grandTotal
      }));

      return updatedItems;
    });
  };




  const calculateTotal = () => {
    return items.reduce((total, item) => {
      return total + item.amount * item.quantity
    }, 0)
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };


  // Function to format date correctly
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not Set";
    const [year, month, day] = dateString.split("-");
    return `${new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })}`;
  };

  const validateForm = () => {
    let isValid = true;

    const newError: any = {
      senderName: "",
      senderAddress: "",
      receiverName: "",
      receiverAddress: "",
      issuedOn: "",
      dueOn: "",
      paidOn: "",
      items: "",

    }


    if (!formData.senderName) {
      newError.senderName = "Sender name is required";
      isValid = false;
    }

    if (!formData.senderAddress) {
      newError.senderAddress = "Sender address is required";
      isValid = false;
    }

    if (!formData.receiverName) {
      newError.receiverName = "Receiver name is required";
      isValid = false;
    }

    if (!formData.receiverAddress) {
      newError.receiverAddress = "Receiver address is required";
      isValid = false;
    }

    if (!formData.issuedOn) {
      newError.issuedOn = "Issued On date is required";
      isValid = false;
    }

    if (!formData.dueOn) {
      newError.dueOn = "Due On date is required";
      isValid = false;
    }

    if (!formData.paidOn) {
      newError.paidOn = "Paid On date is required";
      isValid = false;
    }

    if (items.length === 0) {
      newError.items = "At least one item is required";
      isValid = false;
    }


    // Validate items

    items.forEach((item) => {
      if (!item.description) {
        newError.items = "Each item must have a description";
        isValid = false;
      }
      if (item.amount <= 0) {
        newError.items = "Each item must have a valid amount";
        isValid = false;
      }
    });


    setError(newError);

    return isValid;

  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const InvoiceId = Math.floor(1000 + Math.random() * 9000);
      console.log("Invoice ID: ", InvoiceId)
      if (validateForm()) {
        const finalData = {
          invoiceId: InvoiceId,
          senderName: formData.senderName,
          senderAddress: formData.senderAddress,
          receiverName: formData.receiverName,
          receiverAddress: formData.receiverAddress,
          issuedOn: formData.issuedOn,
          dueOn: formData.dueOn,
          paidOn: formData.paidOn,
          items: items.map(({ id, description, amount, quantity, total }) => ({
            id,
            description,
            amount,
            quantity,
            total,
          })), // ✅ Ensure only `items` contains these fields
          grandTotal: calculateTotal(),
        };

        const response = await axios.post(`${baseURL}/api/invoices/createInvoice`, finalData);
        if (response) {
          console.log("Response Data: ", response.data);
        } else {
          console.log("Response Not Found")
        }

        console.log("Final Invoice Data:", finalData);
        alert("Form Submitted Successfully");
        setFormData({
          senderName: "",
          senderAddress: "",
          receiverName: "",
          receiverAddress: "",
          issuedOn: "",
          dueOn: "",
          paidOn: "",
          items: [] as Item[],
        })

        setItems([{
          id: Date.now().toString(),
          description: "",
          amount: 0,
          quantity: 1,
          total: 0,
        }])

      } else {
        console.log("Form validation failed");
      }
    } catch (error: any) {
      console.error("Error Creating Invoice: ", error.message)
    }
  };


  return (
    <>
      <div className="max-w-5xl mx-auto my-14">
        <div className="grid -grid-cols-1 gap-8">

          <div className="border p-4">
            <h1 className="text-2xl font-medium">Create</h1>
            <form onSubmit={handleSubmit}>

              <div className="grid grid-cols-2 gap-8 my-4">
                <div className="flex flex-col">
                  <label htmlFor="senderName">Sender Name</label>
                  <input
                    type="text"
                    name="senderName"
                    value={formData.senderName}
                    onChange={handleChange}
                    className="border border-transparent focus-border-black mt-1 w-full px-4 py-1 rounded bg-gray-100/60"
                  />
                  {error.senderName && <span className="text-red-500 mt-0.5">{error.senderName}</span>}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="senderAddress">Sender Address</label>
                  <input
                    type="text"
                    name="senderAddress"
                    value={formData.senderAddress}
                    onChange={handleChange}
                    className="border border-transparent focus-border-black mt-1 w-full px-4 py-1 rounded bg-gray-100/60"
                  />
                  {error.senderAddress && <span className="text-red-500 mt-0.5">{error.senderAddress}</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 my-4">
                <div className="flex flex-col">
                  <label htmlFor="receiverName">Receiver Name</label>
                  <input
                    type="text"
                    name="receiverName"
                    value={formData.receiverName}
                    onChange={handleChange}
                    className="border border-transparent focus-border-black mt-1 w-full px-4 py-1 rounded bg-gray-100/60"
                  />
                  {error.receiverName && <span className="text-red-500 mt-0.5">{error.receiverName}</span>}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="receiverAddress">Receiver Address</label>
                  <input
                    type="text"
                    name="receiverAddress"
                    value={formData.receiverAddress}
                    onChange={handleChange}
                    className="border border-transparent focus-border-black mt-1 w-full px-4 py-1 rounded bg-gray-100/60"
                  />
                  {error.receiverAddress && <span className="text-red-500 mt-0.5">{error.receiverAddress}</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 my-4">
                <div className="flex flex-col">
                  <label htmlFor="issued-on">Issued on</label>
                  <input
                    type="date"
                    name="issuedOn"
                    value={formData.issuedOn}
                    onChange={handleChange}
                    className="border border-transparent focus-border-black mt-1 w-full px-4 py-1 rounded bg-gray-100/60"
                  />
                  {error.issuedOn && <span className="text-red-500 mt-0.5">{error.issuedOn}</span>}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="due-on">Due on</label>
                  <input
                    type="date"
                    name="dueOn"
                    value={formData.dueOn}
                    onChange={handleChange}
                    className="border border-transparent focus-border-black mt-1 w-full px-4 py-1 rounded bg-gray-100/60"
                  />
                  {error.dueOn && <span className="text-red-500 mt-0.5">{error.dueOn}</span>}
                </div>
              </div>


              <div className="grid grid-cols-1 gap-8 my-4">
                <div className="flex flex-col">
                  <label htmlFor="issued-on">Paid on</label>
                  <input
                    type="date"
                    name="paidOn"
                    value={formData.paidOn}
                    onChange={handleChange}
                    className="border border-transparent focus-border-black mt-1 w-full px-4 py-1 rounded bg-gray-100/60"
                  />
                  {error.paidOn && <span className="text-red-500 mt-0.5">{error.paidOn}</span>}
                </div>

              </div>


              <div className="rounded px-0 py-2">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">Items</h2>
                  <div className="space-x-2">
                    <button onClick={addItem} className="px-4 py-1 rounded bg-blue-600/80 text-white">add Item</button>
                    <button onClick={clearAll} className="px-4 py-1 rounded bg-red-600/80 text-white">clear All</button>
                  </div>
                </div>

                <div className="border rounded px-1.5 py-1.5 h-full">
                  <table className="w-full h-full border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-2 px-4 text-left">Description</th>
                        <th className="py-2 px-4 text-left">Amount</th>
                        <th className="py-2 px-4 text-left">Quantity</th>
                        <th className="py-2 px-4 text-left">Total</th>
                        <th className="py-2 px-4 text-center">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {items.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-4">
                            No items added. Click "Add Item" to get started.
                          </td>
                        </tr>
                      ) : (
                        items.map((item) => (
                          <tr key={item.id} className="border-b">
                            {/* Description */}
                            <td className="py-2 px-4">
                              <input
                                type="text"
                                value={item.description}
                                name="description"
                                onChange={(e) => {
                                  updateItem(item.id, "description", e.target.value);
                                  handleChange(e);
                                }}
                                placeholder="Enter description"
                                className="border-none focus:ring-0 px-2 py-1.5 h-auto w-full bg-transparent"
                              />
                            </td>

                            {/* Amount */}
                            <td className="py-2 px-4">
                              <input
                                type="number"
                                value={item.amount}
                                name="amount"
                                onChange={(e) => {
                                  updateItem(item.id, "amount", Number.parseFloat(e.target.value) || 0);
                                  handleChange(e)
                                }}
                                placeholder="0.00"
                                className="border-none focus:ring-0 p-0 h-auto w-20 bg-transparent text-left"
                              />
                            </td>

                            {/* Quantity */}
                            <td className="py-2 px-4">
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                                placeholder="1"
                                className="border-none focus:ring-0 p-0 h-auto w-12 text-center bg-transparent"
                              />
                            </td>

                            {/* Total */}
                            <td className="py-2 px-4 font-medium">${(item.amount * item.quantity).toFixed(2)}</td>

                            {/* Delete Button */}
                            <td className="py-2 px-4 flex justify-center">

                              <button
                                onClick={() => deleteItem(item.id)}
                                className="h-10 w-10 text-red-500 hover:text-red-600 hover:bg-red-100 rounded-full flex items-center justify-center"
                              >
                                <Trash2 />
                              </button>

                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>

                    <tfoot>
                      <tr>
                        <td colSpan={4} className="font-bold px-4 py-2">
                          Total
                        </td>
                        <td className="font-bold text-center px-4 py-2">${calculateTotal().toFixed(2)}</td>
                      </tr>
                    </tfoot>

                  </table>
                </div>
                {error.items &&
                  <div className="flex w-full justify-center mt-4">
                    <span className="text-red-500 mt-0.5">{error.items}</span>
                  </div>
                }

              </div>

              <div className="flex justify-end mt-4">
                <button type="submit" className="bg-green-600/90 w-full px-6 py-1.5 rounded text-white">Save</button>
              </div>

            </form>
          </div>



















          <div id="invoice-content" className="border p-4 tracking-wide">
            <h1 className="text-2xl font-medium">Preview</h1>

            <div className="grid grid-cols-2 gap-8 my-4">
              <div className="flex flex-col">
                <span className="text-sm">Issued on</span>
                <span className="text-base font-medium">
                  {formatDate(formData.issuedOn)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm">Due on</span>
                <span className="text-base font-medium">
                  {formatDate(formData.dueOn)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 my-4">
              <div className="flex flex-col">
                <span className="text-sm">From</span>
                <div className="flex flex-col">
                  <span className="text-base font-medium break-words capitalize">
                    {formData.senderName}
                  </span>
                  <span className="text-sm break-words max-w-80 text-gray-500">
                    {formData.senderAddress}
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm">To</span>
                <div className="flex flex-col">
                  <span className="text-base font-medium break-words capitalize">
                    {formData.receiverName}
                  </span>
                  <span className="text-sm break-words  max-w-80 text-gray-500">
                    {formData.receiverAddress}
                  </span>
                </div>
              </div>
            </div>


            <div className="grid grid-cols-2 gap-8 my-4">
              <div className="flex flex-col">
                <span className="text-sm">Paid On</span>

                <span className="text-base font-medium">
                  {formatDate(formData.paidOn)}
                </span>

              </div>
            </div>



            <div className="rounded px-2 py-2">
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
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4">
                          No items added.
                        </td>
                      </tr>
                    ) : (
                      items.map((item) => (
                        <tr key={item.id} className="border-b">
                          {/* Description */}
                          <td className="py-2 px-4 break-words max-w-40">
                            {item.description || <span className="font-medium">Not Set</span>}
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
                              <span>{(item.amount * item.quantity).toFixed(2)}</span>
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
                      <td className="font-bold text-right px-4 py-2 flex justify-end items-center"><IndianRupee className="h-4 w-4" />{calculateTotal().toFixed(2)}</td>

                    </tr>
                  </tfoot>

                </table>

              </div>

            </div>

          </div>

        </div>

        <div className="flex justify-end my-10">
          <button onClick={handlePrint} className="px-10 py-2.5 bg-blue-500/90 text-white">print</button>
        </div>

      </div>
    </>
  );
};

export default CreateInvoice;

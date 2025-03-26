"use client"

import { useState } from "react"
import { Trash2, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Item {
  id: string
  description: string
  amount: number
  quantity: number
}

export default function InvoiceTable() {
  const [items, setItems] = useState<Item[]>([
    {
      id: "1",
      description: "Basic Plan",
      amount: 9.99,
      quantity: 1,
    },
  ])

  const addItem = () => {
    const newItem: Item = {
      id: Date.now().toString(),
      description: "",
      amount: 0,
      quantity: 1,
    }
    setItems([...items, newItem])
  }

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const clearAll = () => {
    setItems([])
  }

  const updateItem = (id: string, field: keyof Item, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value }
        }
        return item
      }),
    )
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      return total + item.amount * item.quantity
    }, 0)
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Items</h2>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-1" /> Add Item
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll}>
            <X className="h-4 w-4 mr-1" /> Clear All
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="w-[150px]">Amount</TableHead>
              <TableHead className="w-[100px]">Qty</TableHead>
              <TableHead className="w-[150px]">Total Amount</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                  No items added. Click "Add Item" to get started.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Input
                      value={item.description}
                      onChange={(e:any) => updateItem(item.id, "description", e.target.value)}
                      placeholder="Enter description"
                      className="border-none focus-visible:ring-0 p-0 h-auto"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-1">$</span>
                      <Input
                        type="number"
                        value={item.amount}
                        onChange={(e:any) => updateItem(item.id, "amount", Number.parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className="border-none focus-visible:ring-0 p-0 h-auto"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e:any) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                      placeholder="1"
                      className="border-none focus-visible:ring-0 p-0 h-auto"
                    />
                  </TableCell>
                  <TableCell className="font-medium">${(item.amount * item.quantity).toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteItem(item.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete item</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} className="font-bold">
                Total
              </TableCell>
              <TableCell className="font-bold">${calculateTotal().toFixed(2)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  )
}
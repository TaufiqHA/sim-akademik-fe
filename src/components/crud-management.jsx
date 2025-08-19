"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { IconPlus, IconPencil, IconTrash } from "@tabler/icons-react"

export function CrudManagement({
  title,
  description,
  columns,
  fetchData,
  deleteData,
  FormComponent,
  formatRowData,
  getRowKey,
  additionalActions
}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const result = await fetchData()
      // Ensure result is an array
      setData(Array.isArray(result) ? result : [])
    } catch (err) {
      setError(err.message || "Failed to load data")
      setData([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (item) => {
    if (!confirm("Are you sure you want to delete this item?")) return
    
    try {
      await deleteData(getRowKey(item))
      await loadData()
    } catch (err) {
      setError(err.message || "Failed to delete item")
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setShowForm(true)
  }

  const handleCreate = () => {
    setEditingItem(null)
    setShowForm(true)
  }

  const handleAdditionalAction = async (actionFn, item) => {
    try {
      await actionFn(item)
      await loadData()
    } catch (err) {
      setError(err.message || "Action failed")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <Button onClick={handleCreate}>
          <IconPlus className="mr-2 h-4 w-4" />
          Tambah
        </Button>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{title} ({data.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key}>{column.label}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(data) && data.map((item) => {
                const formattedData = formatRowData ? formatRowData(item) : item
                return (
                  <TableRow key={getRowKey(item)}>
                    {columns.map((column) => (
                      <TableCell key={column.key} className={column.className}>
                        {formattedData[column.key]}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <IconPencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(item)}
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                        {additionalActions?.map((action, index) => (
                          <Button
                            key={index}
                            variant={action.variant || "outline"}
                            size="sm"
                            onClick={() => handleAdditionalAction(action.fn, item)}
                          >
                            {action.icon && <action.icon className="h-4 w-4" />}
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? `Edit ${title}` : `Create New ${title}`}
            </DialogTitle>
            <DialogDescription>
              {editingItem ? `Update ${title.toLowerCase()} information` : `Add a new ${title.toLowerCase()} to the system`}
            </DialogDescription>
          </DialogHeader>
          <FormComponent
            item={editingItem}
            allData={data}
            onSuccess={() => {
              setShowForm(false)
              loadData()
            }}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

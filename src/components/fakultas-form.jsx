"use client"

import { useState, useEffect } from "react"
import { createFakultas, updateFakultas } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function FakultasForm({ item, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    nama_fakultas: ""
  })

  useEffect(() => {
    if (item) {
      setFormData({
        nama_fakultas: item.nama_fakultas || ""
      })
    }
  }, [item])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!formData.nama_fakultas) {
        throw new Error("Nama fakultas wajib diisi")
      }

      const payload = {
        nama_fakultas: formData.nama_fakultas
      }

      if (item) {
        await updateFakultas(item.id, payload)
      } else {
        await createFakultas(payload)
      }

      onSuccess()
    } catch (err) {
      setError(err.message || "Failed to save fakultas")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="nama_fakultas">Nama Fakultas *</Label>
        <Input
          id="nama_fakultas"
          name="nama_fakultas"
          value={formData.nama_fakultas}
          onChange={handleInputChange}
          disabled={loading}
          required
          placeholder="e.g., Fakultas Teknik"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Saving..." : (item ? "Update" : "Create")}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

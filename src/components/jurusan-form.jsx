"use client"

import { useState, useEffect } from "react"
import { createJurusan, updateJurusan } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function JurusanForm({ item, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    nama_jurusan: ""
  })

  useEffect(() => {
    if (item) {
      setFormData({
        nama_jurusan: item.nama_jurusan || ""
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
      if (!formData.nama_jurusan) {
        throw new Error("Nama jurusan wajib diisi")
      }

      const payload = {
        nama_jurusan: formData.nama_jurusan
      }

      if (item) {
        await updateJurusan(item.id, payload)
      } else {
        await createJurusan(payload)
      }

      onSuccess()
    } catch (err) {
      setError(err.message || "Failed to save jurusan")
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
        <Label htmlFor="nama_jurusan">Nama Jurusan *</Label>
        <Input
          id="nama_jurusan"
          name="nama_jurusan"
          value={formData.nama_jurusan}
          onChange={handleInputChange}
          disabled={loading}
          required
          placeholder="e.g., Teknik Informatika"
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

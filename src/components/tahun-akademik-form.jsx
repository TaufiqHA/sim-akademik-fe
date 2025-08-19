"use client"

import { useState, useEffect } from "react"
import { createTahunAkademik, updateTahunAkademik } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export function TahunAkademikForm({ item, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    nama_tahun: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    is_aktif: false
  })

  useEffect(() => {
    if (item) {
      setFormData({
        nama_tahun: item.nama_tahun || "",
        tanggal_mulai: item.tanggal_mulai ? item.tanggal_mulai.split('T')[0] : "",
        tanggal_selesai: item.tanggal_selesai ? item.tanggal_selesai.split('T')[0] : "",
        is_aktif: item.is_aktif || false
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

  const handleCheckboxChange = (checked) => {
    setFormData(prev => ({
      ...prev,
      is_aktif: checked
    }))
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!formData.nama_tahun || !formData.tanggal_mulai || !formData.tanggal_selesai) {
        throw new Error("Semua field wajib diisi")
      }

      const payload = {
        nama_tahun: formData.nama_tahun,
        tanggal_mulai: formData.tanggal_mulai,
        tanggal_selesai: formData.tanggal_selesai,
        is_aktif: formData.is_aktif
      }

      if (item) {
        await updateTahunAkademik(item.id, payload)
      } else {
        await createTahunAkademik(payload)
      }

      onSuccess()
    } catch (err) {
      setError(err.message || "Failed to save tahun akademik")
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
        <Label htmlFor="nama_tahun">Nama Tahun Akademik *</Label>
        <Input
          id="nama_tahun"
          name="nama_tahun"
          value={formData.nama_tahun}
          onChange={handleInputChange}
          disabled={loading}
          required
          placeholder="e.g., 2023/2024"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tanggal_mulai">Tanggal Mulai *</Label>
        <Input
          id="tanggal_mulai"
          name="tanggal_mulai"
          type="date"
          value={formData.tanggal_mulai}
          onChange={handleInputChange}
          disabled={loading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tanggal_selesai">Tanggal Selesai *</Label>
        <Input
          id="tanggal_selesai"
          name="tanggal_selesai"
          type="date"
          value={formData.tanggal_selesai}
          onChange={handleInputChange}
          disabled={loading}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_aktif"
          checked={formData.is_aktif}
          onCheckedChange={handleCheckboxChange}
          disabled={loading}
        />
        <Label htmlFor="is_aktif">Status Aktif</Label>
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

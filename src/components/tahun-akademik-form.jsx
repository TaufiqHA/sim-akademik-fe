"use client"

import { useState, useEffect } from "react"
import { createTahunAkademik, updateTahunAkademik } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TahunAkademikForm({ item, allData = [], onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    tahun: "",
    semester: "",
    periode_krs_mulai: "",
    periode_krs_selesai: "",
    periode_nilai_mulai: "",
    periode_nilai_selesai: "",
    is_aktif: false
  })

  // Check if there's already an active academic year (excluding current item if editing)
  const hasActiveYear = allData.some(tahun =>
    tahun.is_aktif && (!item || tahun.id !== item.id)
  )

  // Show checkbox only if:
  // 1. No active year exists, OR
  // 2. Current item is already active (for editing)
  const showStatusCheckbox = !hasActiveYear || (item && item.is_aktif)

  useEffect(() => {
    if (item) {
      setFormData({
        tahun: item.tahun || "",
        semester: item.semester || "",
        periode_krs_mulai: item.periode_krs_mulai ? item.periode_krs_mulai.split('T')[0] : "",
        periode_krs_selesai: item.periode_krs_selesai ? item.periode_krs_selesai.split('T')[0] : "",
        periode_nilai_mulai: item.periode_nilai_mulai ? item.periode_nilai_mulai.split('T')[0] : "",
        periode_nilai_selesai: item.periode_nilai_selesai ? item.periode_nilai_selesai.split('T')[0] : "",
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

  const handleSelectChange = (name, value) => {
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
      if (!formData.tahun || !formData.semester || !formData.periode_krs_mulai || !formData.periode_krs_selesai) {
        throw new Error("Field tahun, semester, dan periode KRS wajib diisi")
      }

      const payload = {
        tahun: formData.tahun,
        semester: formData.semester,
        periode_krs_mulai: formData.periode_krs_mulai,
        periode_krs_selesai: formData.periode_krs_selesai,
        periode_nilai_mulai: formData.periode_nilai_mulai,
        periode_nilai_selesai: formData.periode_nilai_selesai,
        is_aktif: showStatusCheckbox ? formData.is_aktif : false
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
        <Label htmlFor="tahun">Tahun Akademik *</Label>
        <Input
          id="tahun"
          name="tahun"
          value={formData.tahun}
          onChange={handleInputChange}
          disabled={loading}
          required
          placeholder="e.g., 2024/2025"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="semester">Semester *</Label>
        <Select value={formData.semester} onValueChange={(value) => handleSelectChange("semester", value)} disabled={loading}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Ganjil">Ganjil</SelectItem>
            <SelectItem value="Genap">Genap</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="periode_krs_mulai">Periode KRS Mulai *</Label>
          <Input
            id="periode_krs_mulai"
            name="periode_krs_mulai"
            type="date"
            value={formData.periode_krs_mulai}
            onChange={handleInputChange}
            disabled={loading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="periode_krs_selesai">Periode KRS Selesai *</Label>
          <Input
            id="periode_krs_selesai"
            name="periode_krs_selesai"
            type="date"
            value={formData.periode_krs_selesai}
            onChange={handleInputChange}
            disabled={loading}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="periode_nilai_mulai">Periode Nilai Mulai</Label>
          <Input
            id="periode_nilai_mulai"
            name="periode_nilai_mulai"
            type="date"
            value={formData.periode_nilai_mulai}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="periode_nilai_selesai">Periode Nilai Selesai</Label>
          <Input
            id="periode_nilai_selesai"
            name="periode_nilai_selesai"
            type="date"
            value={formData.periode_nilai_selesai}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>
      </div>

      {showStatusCheckbox && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_aktif"
            checked={formData.is_aktif}
            onCheckedChange={handleCheckboxChange}
            disabled={loading}
          />
          <Label htmlFor="is_aktif">Status Aktif</Label>
        </div>
      )}

      {!showStatusCheckbox && (
        <div className="p-3 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-md">
          Tahun akademik ini akan dibuat dengan status tidak aktif karena sudah ada tahun akademik yang aktif.
        </div>
      )}

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

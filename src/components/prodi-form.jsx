"use client"

import { useState, useEffect } from "react"
import { createProdi, updateProdi, getFakultas } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ProdiForm({ item, onSuccess, onCancel }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fakultas, setFakultas] = useState([])
  const [formData, setFormData] = useState({
    nama_prodi: "",
    fakultas_id: ""
  })

  // Check if user has a specific fakultas_id (not Super Admin)
  const userHasFakultas = user?.fakultas_id
  const isReadOnlyFakultas = !!userHasFakultas

  useEffect(() => {
    loadFakultas()
    if (item) {
      setFormData({
        nama_prodi: item.nama_prodi || "",
        fakultas_id: item.fakultas_id?.toString() || ""
      })
    } else if (userHasFakultas) {
      // Pre-fill fakultas_id if user has one (Dekan, TU Fakultas)
      setFormData(prev => ({
        ...prev,
        fakultas_id: user.fakultas_id.toString()
      }))
    }
  }, [item, user])

  const loadFakultas = async () => {
    try {
      const data = await getFakultas()
      setFakultas(data)
    } catch (err) {
      setError("Failed to load fakultas")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError("")
  }

  const handleSelectChange = (value) => {
    setFormData(prev => ({
      ...prev,
      fakultas_id: value
    }))
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!formData.nama_prodi || !formData.fakultas_id) {
        throw new Error("Nama prodi dan fakultas wajib diisi")
      }

      const payload = {
        nama_prodi: formData.nama_prodi,
        fakultas_id: parseInt(formData.fakultas_id)
      }

      if (item) {
        await updateProdi(item.id, payload)
      } else {
        await createProdi(payload)
      }

      onSuccess()
    } catch (err) {
      setError(err.message || "Failed to save prodi")
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
        <Label htmlFor="nama_prodi">Nama Program Studi *</Label>
        <Input
          id="nama_prodi"
          name="nama_prodi"
          value={formData.nama_prodi}
          onChange={handleInputChange}
          disabled={loading}
          required
          placeholder="e.g., Teknik Informatika"
        />
      </div>

      {!isReadOnlyFakultas && (
        <div className="space-y-2">
          <Label>Fakultas *</Label>
          <Select
            value={formData.fakultas_id}
            onValueChange={handleSelectChange}
            disabled={loading}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih fakultas" />
            </SelectTrigger>
            <SelectContent>
              {fakultas.map((f) => (
                <SelectItem key={f.id} value={f.id.toString()}>
                  {f.nama_fakultas}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

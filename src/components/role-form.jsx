"use client"

import { useState, useEffect } from "react"
import { createRole, updateRole } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function RoleForm({ role, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    nama_role: ""
  })

  useEffect(() => {
    if (role) {
      setFormData({
        nama_role: role.nama_role || ""
      })
    }
  }, [role])

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
      if (!formData.nama_role) {
        throw new Error("Nama role wajib diisi")
      }

      const payload = {
        nama_role: formData.nama_role
      }

      if (role) {
        await updateRole(role.id, payload)
      } else {
        await createRole(payload)
      }

      onSuccess()
    } catch (err) {
      setError(err.message || "Failed to save role")
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
        <Label htmlFor="nama_role">Nama Role *</Label>
        <Input
          id="nama_role"
          name="nama_role"
          value={formData.nama_role}
          onChange={handleInputChange}
          disabled={loading}
          required
          placeholder="e.g., Super Admin, Dekan, etc."
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Saving..." : (role ? "Update" : "Create")}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

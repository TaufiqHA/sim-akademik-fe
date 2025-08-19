"use client"

import { useState, useEffect } from "react"
import { createUser, updateUser } from "@/lib/api"
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

export function UserForm({ user, roles, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    role_id: "",
    fakultas_id: null,
    prodi_id: null
  })

  useEffect(() => {
    if (user) {
      setFormData({
        nama: user.nama || "",
        email: user.email || "",
        password: "", // Don't populate password for editing
        role_id: user.role_id?.toString() || "",
        fakultas_id: user.fakultas_id || null,
        prodi_id: user.prodi_id || null
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError("")
  }

  const handleSelectChange = (field) => (value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Validation
      if (!formData.nama || !formData.email || !formData.role_id) {
        throw new Error("Nama, email, dan role wajib diisi")
      }

      if (!user && !formData.password) {
        throw new Error("Password wajib diisi untuk user baru")
      }

      const payload = {
        nama: formData.nama,
        email: formData.email,
        role_id: parseInt(formData.role_id),
        fakultas_id: formData.fakultas_id ? parseInt(formData.fakultas_id) : null,
        prodi_id: formData.prodi_id ? parseInt(formData.prodi_id) : null
      }

      // Only include password if provided
      if (formData.password) {
        payload.password = formData.password
      }

      if (user) {
        await updateUser(user.id, payload)
      } else {
        await createUser(payload)
      }

      onSuccess()
    } catch (err) {
      setError(err.message || "Failed to save user")
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
        <Label htmlFor="nama">Nama *</Label>
        <Input
          id="nama"
          name="nama"
          value={formData.nama}
          onChange={handleInputChange}
          disabled={loading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          disabled={loading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          Password {!user && "*"}
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          disabled={loading}
          placeholder={user ? "Leave empty to keep current password" : ""}
          required={!user}
        />
      </div>

      <div className="space-y-2">
        <Label>Role *</Label>
        <Select
          value={formData.role_id}
          onValueChange={handleSelectChange('role_id')}
          disabled={loading}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id.toString()}>
                {role.nama_role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fakultas_id">Fakultas ID (Optional)</Label>
        <Input
          id="fakultas_id"
          name="fakultas_id"
          type="number"
          value={formData.fakultas_id || ""}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            fakultas_id: e.target.value ? parseInt(e.target.value) : null
          }))}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prodi_id">Prodi ID (Optional)</Label>
        <Input
          id="prodi_id"
          name="prodi_id"
          type="number"
          value={formData.prodi_id || ""}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            prodi_id: e.target.value ? parseInt(e.target.value) : null
          }))}
          disabled={loading}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Saving..." : (user ? "Update" : "Create")}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

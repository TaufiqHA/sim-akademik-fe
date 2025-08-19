"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { getCurrentUser, updateUser } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { IconUserCircle, IconMail, IconBuilding, IconSchool, IconKey, IconPencil, IconCheck, IconX } from "@tabler/icons-react"
import { toast } from "sonner"

export default function AccountPage() {
  const { user: authUser } = useAuth()
  const [user, setUser] = useState(authUser)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: ""
  })

  useEffect(() => {
    loadUserData()
  }, [])

  useEffect(() => {
    if (user) {
      setFormData({
        nama: user.nama || "",
        email: user.email || "",
        password: ""
      })
    }
  }, [user])

  const loadUserData = async () => {
    try {
      setLoading(true)
      const userData = await getCurrentUser()
      setUser(userData)
    } catch (err) {
      setError(err.message || "Failed to load user data")
      // Fallback to auth user data if API fails
      setUser(authUser)
    } finally {
      setLoading(false)
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

  const handleEdit = () => {
    setIsEditing(true)
    setError("")
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      nama: user?.nama || "",
      email: user?.email || "",
      password: ""
    })
    setError("")
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError("")

      // Validation
      if (!formData.nama.trim() || !formData.email.trim()) {
        throw new Error("Nama dan email tidak boleh kosong")
      }

      const payload = {
        nama: formData.nama.trim(),
        email: formData.email.trim()
      }

      // Only include password if provided
      if (formData.password.trim()) {
        payload.password = formData.password
      }

      await updateUser(user.id, payload)

      // Update local user state
      setUser(prev => ({
        ...prev,
        nama: payload.nama,
        email: payload.email
      }))

      setIsEditing(false)
      setFormData(prev => ({ ...prev, password: "" }))
      toast.success("Account updated successfully")
    } catch (err) {
      setError(err.message || "Failed to update account")
    } finally {
      setSaving(false)
    }
  }

  const getRoleName = (roleId) => {
    const roles = {
      1: "Super Admin",
      2: "Dekan",
      3: "Kaprodi",
      4: "TU Fakultas",
      5: "TU Prodi",
      6: "Dosen",
      7: "Mahasiswa"
    }
    return roles[roleId] || "Unknown Role"
  }

  const userInitials = user?.nama?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences
        </p>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconUserCircle className="h-5 w-5" />
                Profile Information
              </div>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <IconPencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancel} disabled={saving}>
                    <IconX className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={saving}>
                    <IconCheck className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </div>
              )}
            </CardTitle>
            <CardDescription>
              Your basic account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{user?.nama}</h3>
                <p className="text-muted-foreground">{user?.email}</p>
                <Badge variant="secondary" className="mt-1">
                  {getRoleName(user?.role_id)}
                </Badge>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nama">Full Name</Label>
                <Input
                  id="nama"
                  name="nama"
                  value={isEditing ? formData.nama : (user?.nama || "")}
                  onChange={handleInputChange}
                  disabled={!isEditing || saving}
                  className={!isEditing ? "bg-muted" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={isEditing ? formData.email : (user?.email || "")}
                  onChange={handleInputChange}
                  disabled={!isEditing || saving}
                  className={!isEditing ? "bg-muted" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={getRoleName(user?.role_id)}
                  disabled
                  className="bg-muted"
                />
              </div>
              {isEditing && (
                <div className="space-y-2">
                  <Label htmlFor="password">New Password (Optional)</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={saving}
                    placeholder="Leave empty to keep current password"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Organization Information */}
        {(user?.fakultas_id || user?.prodi_id) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconBuilding className="h-5 w-5" />
                Organization
              </CardTitle>
              <CardDescription>
                Your faculty and program information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {user?.fakultas_id && (
                  <div className="space-y-2">
                    <Label htmlFor="fakultas">Faculty ID</Label>
                    <Input
                      id="fakultas"
                      value={user.fakultas_id}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                )}
                {user?.prodi_id && (
                  <div className="space-y-2">
                    <Label htmlFor="prodi">Program ID</Label>
                    <Input
                      id="prodi"
                      value={user.prodi_id}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconKey className="h-5 w-5" />
              Account Actions
            </CardTitle>
            <CardDescription>
              Manage your account security and data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              onClick={loadUserData}
              disabled={loading}
            >
              Refresh Account Data
            </Button>
            <p className="text-sm text-muted-foreground">
              Last updated: {user?.updated_at ? new Date(user.updated_at).toLocaleString() : 'Unknown'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

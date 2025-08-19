"use client"

import { useEffect, useState } from "react"
import { getRoles, deleteRole } from "@/lib/api"
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
import { RoleForm } from "@/components/role-form"

export default function RolesPage() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showRoleForm, setShowRoleForm] = useState(false)
  const [editingRole, setEditingRole] = useState(null)

  useEffect(() => {
    loadRoles()
  }, [])

  const loadRoles = async () => {
    try {
      setLoading(true)
      const rolesData = await getRoles()
      setRoles(Array.isArray(rolesData) ? rolesData : [])
    } catch (err) {
      setError(err.message || "Failed to load roles")
      setRoles([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRole = async (id) => {
    if (!confirm("Are you sure you want to delete this role?")) return
    
    try {
      await deleteRole(id)
      await loadRoles()
    } catch (err) {
      setError(err.message || "Failed to delete role")
    }
  }

  const handleEditRole = (role) => {
    setEditingRole(role)
    setShowRoleForm(true)
  }

  const handleCreateRole = () => {
    setEditingRole(null)
    setShowRoleForm(true)
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
          <h1 className="text-3xl font-bold">Manajemen Role</h1>
          <p className="text-muted-foreground">
            Kelola peran pengguna dalam sistem
          </p>
        </div>
        <Button onClick={handleCreateRole}>
          <IconPlus className="mr-2 h-4 w-4" />
          Tambah Role
        </Button>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Manajemen Role ({roles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nama Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.id}</TableCell>
                  <TableCell className="font-medium">{role.nama_role}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditRole(role)}
                      >
                        <IconPencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteRole(role.id)}
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showRoleForm} onOpenChange={setShowRoleForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingRole ? 'Edit Role' : 'Create New Role'}
            </DialogTitle>
            <DialogDescription>
              {editingRole ? 'Update role information' : 'Add a new role to the system'}
            </DialogDescription>
          </DialogHeader>
          <RoleForm
            role={editingRole}
            onSuccess={() => {
              setShowRoleForm(false)
              loadRoles()
            }}
            onCancel={() => setShowRoleForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { getUsers, getRoles, deleteUser, getFakultas, getProdi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { IconPlus, IconPencil, IconTrash, IconSearch } from "@tabler/icons-react"
import { UserForm } from "@/components/user-form"

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [fakultas, setFakultas] = useState([])
  const [prodi, setProdi] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [showUserForm, setShowUserForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [usersData, rolesData, fakultasData, prodiData] = await Promise.all([
        getUsers({ search: searchTerm, role_id: selectedRole }),
        getRoles(),
        getFakultas(),
        getProdi()
      ])
      setUsers(Array.isArray(usersData) ? usersData : [])
      setRoles(Array.isArray(rolesData) ? rolesData : [])
      setFakultas(Array.isArray(fakultasData) ? fakultasData : [])
      setProdi(Array.isArray(prodiData) ? prodiData : [])
    } catch (err) {
      setError(err.message || "Failed to load data")
      setUsers([])
      setRoles([])
      setFakultas([])
      setProdi([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    try {
      const usersData = await getUsers({
        search: searchTerm,
        role_id: selectedRole
      })
      setUsers(Array.isArray(usersData) ? usersData : [])
    } catch (err) {
      setError(err.message || "Failed to search users")
      setUsers([])
    }
  }

  const handleDeleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return
    
    try {
      await deleteUser(id)
      await loadData() // Reload data
    } catch (err) {
      setError(err.message || "Failed to delete user")
    }
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setShowUserForm(true)
  }

  const handleCreateUser = () => {
    setEditingUser(null)
    setShowUserForm(true)
  }

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId)
    return role?.nama_role || 'Unknown'
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
          <h1 className="text-3xl font-bold">Manajemen User</h1>
          <p className="text-muted-foreground">
            Kelola pengguna sistem akademik
          </p>
        </div>
        <Button onClick={handleCreateUser}>
          <IconPlus className="mr-2 h-4 w-4" />
          Tambah User
        </Button>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Manajemen User ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell className="font-medium">{user.nama}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {getRoleName(user.role_id)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <IconPencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
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

      <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Edit User' : 'Create New User'}
            </DialogTitle>
            <DialogDescription>
              {editingUser ? 'Update user information' : 'Add a new user to the system'}
            </DialogDescription>
          </DialogHeader>
          <UserForm
            user={editingUser}
            roles={roles}
            fakultas={fakultas}
            prodi={prodi}
            onSuccess={() => {
              setShowUserForm(false)
              loadData()
            }}
            onCancel={() => setShowUserForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

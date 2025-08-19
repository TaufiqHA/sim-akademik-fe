"use client"

import { useSearchParams } from "next/navigation"
import { getProdi, deleteProdi, getFakultas } from "@/lib/api"
import { CrudManagement } from "@/components/crud-management"
import { ProdiForm } from "@/components/prodi-form"
import { useAuth } from "@/hooks/use-auth"
import { useEffect, useState } from "react"

const columns = [
  { key: "id", label: "ID" },
  { key: "nama_prodi", label: "Nama Prodi", className: "font-medium" }
]

export default function ProdiPage() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const fakultasIdFromUrl = searchParams.get('fakultas_id')
  const [fakultasName, setFakultasName] = useState("")

  // Determine which fakultas_id to use:
  // 1. If user has fakultas_id (Dekan, TU Fakultas), use user's fakultas_id
  // 2. If URL has fakultas_id parameter, use that (for Super Admin)
  // 3. Otherwise, show all (for Super Admin without filter)
  const facultyId = user?.fakultas_id || fakultasIdFromUrl

  useEffect(() => {
    // Get fakultas name for display
    if (facultyId) {
      getFakultas().then(fakultasList => {
        const fakultas = fakultasList.find(f => f.id === parseInt(facultyId))
        setFakultasName(fakultas?.nama_fakultas || "")
      }).catch(console.error)
    }
  }, [facultyId])

  // Create filtered fetch function
  const fetchFilteredProdi = async () => {
    const result = await getProdi()
    if (facultyId) {
      // Filter prodi by fakultas_id (either from user or URL parameter)
      return result.filter(prodi => prodi.fakultas_id === parseInt(facultyId))
    }
    return result // Show all if no filter (Super Admin)
  }

  const title = facultyId && fakultasName
    ? `Program Studi - ${fakultasName}`
    : "Manajemen Program Studi"

  const description = facultyId
    ? `Kelola program studi untuk ${fakultasName}`
    : "Kelola program studi dalam sistem akademik"

  return (
    <CrudManagement
      title={title}
      description={description}
      columns={columns}
      fetchData={fetchFilteredProdi}
      deleteData={deleteProdi}
      FormComponent={ProdiForm}
      getRowKey={(item) => item.id}
    />
  )
}

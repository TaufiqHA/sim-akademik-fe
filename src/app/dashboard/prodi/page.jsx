"use client"

import { getProdi, deleteProdi } from "@/lib/api"
import { CrudManagement } from "@/components/crud-management"
import { ProdiForm } from "@/components/prodi-form"

const columns = [
  { key: "id", label: "ID" },
  { key: "nama_prodi", label: "Nama Prodi", className: "font-medium" },
  { key: "fakultas_id", label: "Fakultas ID" }
]

export default function ProdiPage() {
  return (
    <CrudManagement
      title="Manajemen Program Studi"
      description="Kelola program studi dalam sistem akademik"
      columns={columns}
      fetchData={getProdi}
      deleteData={deleteProdi}
      FormComponent={ProdiForm}
      getRowKey={(item) => item.id}
    />
  )
}

"use client"

import { getJurusan, deleteJurusan } from "@/lib/api"
import { CrudManagement } from "@/components/crud-management"
import { JurusanForm } from "@/components/jurusan-form"

const columns = [
  { key: "id", label: "ID" },
  { key: "nama_jurusan", label: "Nama Jurusan", className: "font-medium" }
]

export default function JurusanPage() {
  return (
    <CrudManagement
      title="Manajemen Jurusan"
      description="Kelola jurusan dalam sistem akademik"
      columns={columns}
      fetchData={getJurusan}
      deleteData={deleteJurusan}
      FormComponent={JurusanForm}
      getRowKey={(item) => item.id}
    />
  )
}

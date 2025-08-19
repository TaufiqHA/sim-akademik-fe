"use client";

import {
  getTahunAkademik,
  deleteTahunAkademik,
  setTahunAkademikAktif,
} from "@/lib/api";
import { CrudManagement } from "@/components/crud-management";
import { TahunAkademikForm } from "@/components/tahun-akademik-form";
import { Badge } from "@/components/ui/badge";
import { IconCheck } from "@tabler/icons-react";

const columns = [
  { key: "id", label: "ID" },
  { key: "tahun", label: "Tahun Akademik", className: "font-medium" },
  { key: "semester", label: "Semester" },
  { key: "periode_krs_mulai", label: "KRS Mulai" },
  { key: "periode_krs_selesai", label: "KRS Selesai" },
  { key: "status", label: "Status" },
];

const formatRowData = (item) => ({
  ...item,
  periode_krs_mulai: item.periode_krs_mulai
    ? new Date(item.periode_krs_mulai).toLocaleDateString()
    : "-",
  periode_krs_selesai: item.periode_krs_selesai
    ? new Date(item.periode_krs_selesai).toLocaleDateString()
    : "-",
  status: item.is_aktif ? (
    <Badge variant="default">Aktif</Badge>
  ) : (
    <Badge variant="secondary">Tidak Aktif</Badge>
  ),
});

const additionalActions = [
  {
    label: "Set Aktif",
    icon: IconCheck,
    variant: "default",
    fn: (item) => setTahunAkademikAktif(item.id),
  },
];

export default function TahunAkademikPage() {
  return (
    <CrudManagement
      title="Manajemen Tahun Akademik"
      description="Kelola tahun akademik dan status aktif"
      columns={columns}
      fetchData={getTahunAkademik}
      deleteData={deleteTahunAkademik}
      FormComponent={TahunAkademikForm}
      formatRowData={formatRowData}
      getRowKey={(item) => item.id}
      additionalActions={additionalActions}
    />
  );
}

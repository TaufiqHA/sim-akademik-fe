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
  { key: "periode_krs_mulai", label: "Tanggal Mulai" },
  { key: "periode_krs_selesai", label: "Tanggal Selesai" },
  { key: "status", label: "Status" },
];

const formatRowData = (item) => ({
  ...item,
  tanggal_mulai: item.tanggal_mulai
    ? new Date(item.tanggal_mulai).toLocaleDateString()
    : "-",
  tanggal_selesai: item.tanggal_selesai
    ? new Date(item.tanggal_selesai).toLocaleDateString()
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

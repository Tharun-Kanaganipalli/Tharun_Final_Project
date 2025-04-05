import PageTitle from "@/components/page-title";
import React from "react";
import SalonForm from "../../_common/salon-form";
import { getSalonById } from "@/actions/salons";
import Info from "@/components/info";

interface EditSalonPageProps {
  params: Promise<{ id: string }>;
}

async function EditSalonPage({ params }: EditSalonPageProps) {
  const { id } = await params;
  const response = await getSalonById(id);
  if (!response.success) {
    return <Info message={response.message} />;
  }
  return (
    <div>
      <PageTitle title="Edit salon" />
      <SalonForm formType="edit" initialValues={response.data} />
    </div>
  );
}

export default EditSalonPage;

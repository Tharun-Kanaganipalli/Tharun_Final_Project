import PageTitle from '@/components/page-title'
import React from 'react'
import SalonForm from '../_common/salon-form'

function AddNewSalonPage() {
  return (
    <div>
        <PageTitle title="Add new salon" />
        <SalonForm formType="add" />
    </div>
  )
}

export default AddNewSalonPage
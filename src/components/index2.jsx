import React, { useEffect, useState } from "react";
import { addRole, getAllRoles } from "./hooks";
import DataTable from "../../Components/shared/DataTable";
import FormModal from "../../Components/shared/formModal";
import AddRoleForm from "./form";
import { fetchData } from "../../utils/apiClients";

const RoleRoute = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState(false);

  const { data, isLoading } = getAllRoles();
  const { mutate: addRoles } = addRole();

  const columnDefs = [
    {
      field: "srNo",
      headerName: "Sr No",
      cellRenderer: (params) =>  params.node.rowIndex + 1, // Correct way to show index
    },
    {
      field: "roleName",
      headerName: "Role Name",
    },
  ];

  const handleAddClick = () => {
    setIsOpen(true);
  };

  const handleEditClick = (data) => {
    setEditData(data);
    setIsOpen(true);
  };

  const handleSubmit = (formData) => {
    console.log(formData);

    addRoles(formData);
  };
  

    const getAllData =async ()=>{
      // console.log('in getAll')
       return await fetchData(`/user/getAllRoles`)
    }

  return (
    <div>
      <h1 className="heading-color">Role</h1>

      <DataTable
        rowData={data}
        colDefs={columnDefs}
        isLoading={isLoading}
        onAddClick={handleAddClick}
        showPagination={false}
        pagination={true}
        showRowsPerPage={false}
        onEditClick={handleEditClick}
        fileName={'roles'}
        allData={getAllData}
      />

      <FormModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title="Add Role"
        onCloseAction={() => setIsOpen(false)}
        height="auto"
        width="60%"
        formId="formId"
        aria-hidden={!isOpen}
      >
        <AddRoleForm
          onSubmit={handleSubmit}
          formId="formId"
          defaultValues={editData}
        />
      </FormModal>
    </div>
  );
};

export default RoleRoute;

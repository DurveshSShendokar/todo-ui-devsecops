import React, { useState, useEffect } from "react";
import { getAllRoles } from "../Configuration/hooks";
import {
  Accordion,
  AccordionItem,
  Card,
  CardBody,
  CardHeader,
  Divider,
} from "@nextui-org/react";

import AccordionWithCheckboxes from "./rolePermissionCard";
import {
  getPermissionsAndActionByRole,
  updateRolePermission,
  updateRolePermissionAction,
} from "./hooks";
import AutoCompleteDropdown from "../../Components/shared/autoCompleteDropdown";

const RolePermissionRoute = () => {
  const [roleId, setRoleId] = useState(null);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [permissionsState, setPermissionsState] = useState({});
  const [expandedKeys, setExpandedKeys] = useState(new Set());
  const { data: allRoles = [] } = getAllRoles();
  const { mutate: updateRolePermissions } = updateRolePermission();
  const { mutate: updateRolePermissionActions } = updateRolePermissionAction();

  const userData = JSON.parse(localStorage.getItem("userDetails")) || {};
  const userId = userData?.userId;
  const { data: permissionsAndActionByRole = {} } =
    getPermissionsAndActionByRole(roleId, userId);

  useEffect(() => {
    if (allRoles.length > 0) {
      setIsCardVisible(true);
    }
  }, [allRoles]);

  useEffect(() => {
    if (Object.keys(permissionsAndActionByRole).length > 0) {
      setTimeout(() => {
        setIsContentVisible(true);
        setPermissionsState(permissionsAndActionByRole);
      }, 200);
    } else {
      setIsContentVisible(false);
      setPermissionsState({});
    }
  }, [permissionsAndActionByRole]);

  const handleRoleSelection = (data) => {
    console.log(data);

    setRoleId(data);
  };

  const handlePermissionChange = (category, permissionId, isChecked) => {
    setPermissionsState((prev) => ({
      ...prev,
      [category]: prev[category].map((permission) =>
        permission.permissionsId === permissionId
          ? { ...permission, selected: isChecked }
          : permission
      ),
    }));

    const payload = {
      roleId: roleId,
      permissionId: permissionId,
      selected: isChecked,
    };

    updateRolePermissions(payload);
  };

  const handleActionChange = (
    category,
    permissionId,
    actionIndex,
    isChecked
  ) => {
    setPermissionsState((prev) => ({
      ...prev,
      [category]: prev[category].map((permission) => {
        if (permission.permissionsId === permissionId) {
          const updatedActions = [...permission.actions];
          updatedActions[actionIndex].selected = isChecked;
          return { ...permission, actions: updatedActions };
        }
        return permission;
      }),
    }));

    const actionName = permissionsState[category].find(
      (p) => p.permissionsId === permissionId
    )?.actions[actionIndex]?.actionName;

    const payload = {
      roleId: roleId,
      permissionId: permissionId,
      actionName: actionName,
      selected: isChecked,
    };

    updateRolePermissionActions(payload);
  };

  useEffect(() => {
    // Open all categories when permissionsState is updated
    setExpandedKeys(new Set(Object.keys(permissionsState)));
  }, [permissionsState]);

  const handleAccordionChange = (keys) => {
    setExpandedKeys(keys);
  };

  return (
    <div className="w-full p-4">
      <h1 className="heading-color text-center text-2xl font-bold mb-4">
        Role Permission
      </h1>
      <div
        className={`transition-all duration-500 transform ${
          isCardVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-6"
        }`}
      >
        <Card className="w-full">
          <CardHeader className="flex justify-center">
            <AutoCompleteDropdown
              label="Role"
              placeholder="Select a Role"
              data={
                allRoles?.map((role) => ({
                  key: role.roleId,
                  label: role.roleName,
                })) || []
              }
              onSelectionChange={handleRoleSelection}
              className="w-1/3"
            />
          </CardHeader>
          <Divider />

          <CardBody
            className={`transition-all duration-500 transform ${
              isContentVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4"
            }`}
          >
            <Accordion
              variant="shadow"
              selectionMode="multiple"
              selectedKeys={expandedKeys}
              onSelectionChange={handleAccordionChange}
            >
              {Object.entries(permissionsState).map(([category, permissions]) =>
                permissions.length > 0 ? (
                  <AccordionItem
                    key={category}
                    aria-label={category}
                    title={
                      category
                        .replace("Permission", "")
                        .charAt(0)
                        .toUpperCase() +
                      category.replace("Permission", "").slice(1)
                    }
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                      {permissions.map((permission) => (
                        <AccordionWithCheckboxes
                          key={permission.permissionsId}
                          title={permission.permissionsName}
                          selected={permission.selected}
                          onSelectChange={(isChecked) =>
                            handlePermissionChange(
                              category,
                              permission.permissionsId,
                              isChecked
                            )
                          }
                          actions={permission.actions}
                          onActionChange={(index, isChecked) =>
                            handleActionChange(
                              category,
                              permission.permissionsId,
                              index,
                              isChecked
                            )
                          }
                        />
                      ))}
                    </div>
                  </AccordionItem>
                ) : null
              )}
            </Accordion>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default RolePermissionRoute;

export const adminTableColumns = [
  {
    id: "S.No",
    label: "S.No",
    minWidth: 70,
    align: "left",
  },
  {
    id: "name",
    label: "Full Name",
    minWidth: 70,
    align: "left",
  },
  {
    id: "email",
    label: "Email",
    minWidth: 70,
    align: "left",
  },
  {
    id: "role",
    label: "Role",
    minWidth: 70,
    align: "center",
  },
  // {
  //   id: "isActive",
  //   label: "Permissions",
  //   minWidth: 70,
  //   align: "center",
  // },
  {
    id: "action",
    label: "Action",
    minWidth: 100,
    align: "center",
  },
];

export const adminformFields = (permissions) => {
  console.log("hereinis", permissions);
  const adminformFields = [
    { name: "name", label: "Name", type: "text", required: true },
    {
      name: "phoneNumber",
      label: "Phone Number",
      type: "number",
      required: true,
    },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "password", label: "Password", type: "password", required: true },
    {
      name: "role",
      label: "Role",
      type: "text",
      isMultiSelect: false,
      options: ["SUPER_ADMIN", "ADMIN"],
      required: true,
    },
    {
      name: "permissions",
      label: "Permissions",
      type: "text",
      isMultiSelect: true,
      options: permissions,
      required: true,
    },
  ];

  return adminformFields;
};

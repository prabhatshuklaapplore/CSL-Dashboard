export const teamstableColumns = [
  {
    id: "S.No",
    label: "S.No",
    minWidth: 70,
    align: "left",
  },
  {
    id: "employeeId",
    label: "Employee id",
    minWidth: 120,
    align: "left",
  },
  {
    id: "fullname",
    label: "Name",
    minWidth: 100,
    align: "left",
  },
  {
    id: "email",
    label: "Email",
    minWidth: 100,
    align: "left",
  },
  {
    id: "phone",
    label: "Mobile",
    minWidth: 70,
    align: "left",
  },
  {
    id: "address",
    label: "Address",
    minWidth: 100,
    align: "center",
  },
  {
    id: "supervisor",
    label: "Report to (name)",
    minWidth: 100,
    align: "center",
  },
  {
    id: "userType",
    label: "Branch",
    minWidth: 70,
    align: "center",
  },
  {
    id: "isActive",
    label: "Sub-Area",
    minWidth: 70,
    align: "center",
  },
  // {
  //   id: "password",
  //   label: "Password",
  //   minWidth: 70,
  //   align: "center",
  // },
  {
    id: "active",
    label: "Status",
    minWidth: 50,
    align: "center",
  },
  {
    id: "action",
    label: "Action",
    minWidth: 100,
    align: "center",
  },
];

export const featureformFields = [
  { name: "employeeId", label: "Employee Id", type: "text", required: true },
  { name: "fullname", label: "Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Mobile", type: "text", required: true },
  { name: "address", label: "Address", type: "text", required: true },
  {
    name: "supervisor",
    label: "Report To(name)",
    type: "text",
    required: true,
  },
  {
    name: "supervisorEmail",
    label: "Report To(email)",
    type: "email",
    required: true,
  },
  { name: "branch", label: "Branch", type: "text", required: true },
  { name: "subarea", label: "Sub-Area", type: "text", required: true },
  { name: "password", label: "Password", type: "password", required: true },
];

export const bulkUploadFields = [
  {
    name: "allTeamData",
    label: "Team Data ( .xlxs)",
    type: "file",
    required: true,
  },
];

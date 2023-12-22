export const adminActionableColumns = [
  {
    id: "S.No",
    label: "S.No",
    minWidth: 70,
    align: "left",
  },
  {
    id: "createdAt",
    label: "Date",
    minWidth: 70,
    align: "left",
  },
  {
    id: "vendorName",
    label: "Full Name",
    minWidth: 70,
    align: "left",
  },
  {
    id: "email",
    label: "Vendor Email",
    minWidth: 70,
    align: "left",
  },
  {
    id: "addonName",
    label: "Addon Purchased",
    minWidth: 70,
    align: "left",
  },
  {
    id: "status",
    label: "Status",
    minWidth: 70,
    align: "center",
  },
  {
    id: "remark",
    label: "Remark",
    minWidth: 70,
    align: "center",
  },
  {
    id: "action",
    label: "Action",
    minWidth: 100,
    align: "center",
  },
];

export const adminActionableformFields = [
  {
    name: "vendorId.fullName",
    label: "Full Name",
    type: "text",
    required: false,
    disabled: true,
  },
  {
    name: "addon.name",
    label: "Addon Purchased",
    type: "text",
    required: false,
    disabled: true,
  },
  {
    name: "status",
    label: "Status",
    type: "text",
    isMultiSelect: false,
    options: ["OPEN", "IN PROGRESS", "DONE"],
    required: true,
  },
  {
    name: "remark",
    label: "Remark",
    type: "text",
    required: true,
  },
];

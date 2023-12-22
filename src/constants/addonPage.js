export const addonColumns = [
  {
    id: "S.No",
    label: "S.No",
    minWidth: 70,
    align: "left",
  },
  {
    id: "name",
    label: "Name",
    minWidth: 70,
    align: "left",
  },
  {
    id: "description",
    label: "Description",
    minWidth: 70,
    align: "left",
  },
  {
    id: "value",
    label: "Price (in USD)",
    minWidth: 70,
    align: "left",
  },
  {
    id: "isActive",
    label: "Active",
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

export const addonformFields = [
  {
    name: "name",
    label: "Name",
    type: "text",
    required: true,
  },
  {
    name: "description",
    label: "Description",
    type: "text",
    required: true,
  },
  {
    name: "value",
    label: "Price (in USD)",
    type: "number",
    required: true,
  },
];

export const tokenPointsColumns = [
  {
    id: "S.No",
    label: "S.No",
    minWidth: 70,
    align: "left",
  },
  {
    id: "type",
    label: "Point Categories",
    minWidth: 70,
    align: "left",
  },
  {
    id: "format",
    label: "Points Format",
    minWidth: 70,
    align: "left",
  },
  {
    id: "value",
    label: "Tokens",
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

export const tokenPointsformFields = [
  {
    name: "type",
    label: "Point Categories",
    type: "text",
    required: true,
  },
  {
    name: "format",
    label: "Points Format",
    type: "text",
    isMultiSelect: false,
    options: ["PERCENTAGE", "FIXED"],
    required: true,
  },
  {
    name: "value",
    label: "Tokens",
    type: "number",
    required: true,
  },
];

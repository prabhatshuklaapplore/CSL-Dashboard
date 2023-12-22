export const featuretableColumns = [
  {
    id: "name",
    label: "Feature Name",
    minWidth: 70,
    align: "left",
  },
  {
    id: "image",
    label: "Image",
    minWidth: 70,
    align: "center",
    type: "IMAGE",
  },
  {
    id: "svg",
    label: "Icon",
    minWidth: 70,
    align: "center",
    type: "IMAGE",
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

export const featureformFields = [
  { name: "name", label: "Category Name", type: "text", required: true },
  
  {
    name: "svg",
    label: "Category Icon (.svg)",
    type: "file",
    required: true,
  },
];

export const plantableColumns = [
  {
    id: "S.No",
    label: "S.No",
    minWidth: 70,
    align: "left",
  },
  {
    id: "dateOfVisit",
    label: "Plan date Of visit",
    minWidth: 120,
    align: "left",
  },
  {
    id: "property.name",
    label: "Property name",
    minWidth: 100,
    align: "left",
  },
  {
    id: "property.address",
    label: "Property address",
    minWidth: 100,
    align: "left",
  },
  {
    id: "property.borrowerName",
    label: "Borrower name",
    minWidth: 70,
    align: "left",
  },
  {
    id: "property.projectZone",
    label: "Zone",
    minWidth: 100,
    align: "center",
  },
  {
    id: "user.fullname",
    label: "Assigned to",
    minWidth: 100,
    align: "center",
  },
  {
    id: "action",
    label: "Action",
    minWidth: 100,
    align: "center",
  },
];

export const planFormFields = [
  // {
  //   name: "name",
  //   label: "Property Name",
  //   type: "text",
  //   required: false,
  //   disabled: true,
  // },
  // {
  //   name: "user.fullname",
  //   label: "User",
  //   type: "text",
  //   required: false,
  //   disabled: true,
  // },
  // {
  //   name: "dateOfVisit",
  //   label: "Date of Visit ",
  //   type: "date",
  //   required: false,
  // },
  // {
  //   name: "assigned",
  //   label: "Assined to",
  //   // type: "date",
  //   required: false,
  // },

  {
    name: "dateOfVisit",
    label: "Date of Visit ",
    type: "date",
    required: false,
  },
  {
    name: "property.address",
    label: "Property address",
    type: "text",
    required: false,
  },
  {
    name: "property.borrowerName",
    label: "Borrower name",
    type: "text",
    required: false,
  },
  {
    name: "property.projectZone",
    label: "Project Zone",
    type: "text",
    required: false,
  },
  {
    name: "user",
    label: "Assinned to",
    type: "option",
    required: false,
  },
];

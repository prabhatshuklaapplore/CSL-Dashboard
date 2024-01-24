export const projectDirtableColumns = [
  {
    id: "S.No",
    label: "S.No",
    minWidth: 70,
    align: "left",
  },
  {
    id: "propertyid",
    label: "Property Id",
    minWidth: 70,
    align: "left",
  },
  {
    id: "groupName",
    label: "Borrower Group Name",
    minWidth: 100,
    align: "left",
  },
  {
    id: "name",
    label: "Project Name",
    minWidth: 100,
    align: "left",
  },
  {
    id: "projectZone",
    label: "Project Location/ Zone",
    minWidth: 70,
    align: "left",
  },
  {
    id: "address",
    label: "Project Address",
    minWidth: 100,
    align: "center",
  },
  {
    id: "projectGeoLocation",
    label: "Project GeoLocation",
    minWidth: 100,
    align: "center",
  },
  {
    id: "borrowerName",
    label: "Borrower Name",
    minWidth: 100,
    align: "center",
  },
  {
    id: "lan",
    label: "LAN No.",
    minWidth: 100,
    align: "center",
  },
  {
    id: "borrowerMobile",
    label: "Borrower Mobile No.",
    minWidth: 100,
    align: "center",
  },

  {
    id: "borrowerAddress",
    label: "Borrower Address",
    minWidth: 100,
    align: "center",
  },
  {
    id: "loanSanctionAmount",
    label: "Loan Sanction Amount",
    minWidth: 100,
    align: "center",
  },
  {
    id: "loadPOS",
    label: "Loan POS",
    minWidth: 100,
    align: "center",
  },
  {
    id: "groupSanctionAmount",
    label: "Group Sanction Amount",
    minWidth: 100,
    align: "center",
  },
  {
    id: "groupPOS",
    label: "Group POS",
    minWidth: 100,
    align: "center",
  },
  {
    id: "propertyType.name",
    label: "Project Type",
    minWidth: 100,
    align: "center",
  },
  // {
  //   id: "projectCost",
  //   label: "Project Cost",
  //   minWidth: 100,
  //   align: "center",
  // },
  {
    id: "active",
    label: "Status",
    minWidth: 100,
    align: "center",
  },
  {
    id: "dateOfVisit",
    label: "Last visit date",
    minWidth: 120,
    align: "center",
  },
  // {
  //   id: "labours",
  //   label: "No. Of labours",
  //   minWidth: 100,
  //   align: "center",
  // },
];

export const eventsFormFields = [
  {
    name: "title",
    label: "Title",
    type: "text",
    required: false,
    disabled: true,
  },
  {
    name: "type",
    label: "Event Type",
    type: "text",
    required: false,
    disabled: true,
  },
  {
    name: "organizer",
    label: "Organizer",
    type: "text",
    required: false,
    disabled: true,
  },
  {
    name: "startDate",
    label: "Event Start Date",
    type: "date",
    required: false,
  },
  {
    name: "startTime",
    label: "Event Start Time",
    type: "time",
    required: false,
  },
  {
    name: "endDate",
    label: "Event End Date",
    type: "date",
    required: false,
  },
  {
    name: "endTime",
    label: "Event End Time",
    type: "time",
    required: false,
  },
  {
    name: "address",
    label: "Address",
    type: "text",
    required: false,
    disabled: true,
  },
  {
    name: "city",
    label: "City",
    type: "text",
    required: false,
    disabled: true,
  },
  {
    name: "country",
    label: "Country",
    type: "text",
    required: false,
    disabled: true,
  },
];

export const projectDirformFields = [
  { name: "propertyId", label: "Property Id", type: "text", required: true },
  {
    name: "borrowerGroup",
    label: "Borrower Group",
    type: "text",
    required: true,
  },
  { name: "projectName", label: "Project Name", type: "text", required: true },
  {
    name: "projectLocation",
    label: "Project Location/Zone",
    type: "text",
    required: true,
  },
  {
    name: "projectAddress",
    label: "Project Address",
    type: "text",
    required: true,
  },
  {
    name: "projectGeoLocation",
    label: "Project Geo Location",
    type: "text",
    required: true,
  },
  {
    name: "borrowerName",
    label: "Borrower Name",
    type: "text",
    required: true,
  },
  { name: "lan", label: "LAN no. ", type: "text", required: true },
  {
    name: "borrowerAddress",
    label: "Borrower Address",
    type: "text",
    required: true,
  },
  {
    name: "loanSanctionAmount",
    label: "Loan Sanction Amount",
    type: "number",
    required: true,
  },
  {
    name: "groupSanctionAmount",
    label: "Group Sanction Amount",
    type: "number",
    required: true,
  },
  { name: "groupPos", label: "Group POS", type: "number", required: true },
  { name: "projectType", label: "Project Type", type: "text", required: true },
  { name: "zone", label: "Zone", type: "text", required: true },
  {
    name: "lastVisitDate",
    label: "Last Visit Date",
    type: "date",
    required: true,
  },
  {
    name: "labours",
    label: "Number of Labours",
    type: "number",
    required: true,
  },
];

export const bulkUploadFields = [
  {
    name: "allTeamData",
    label: "Project directory Data ( .xlxs)",
    type: "file",
    required: true,
  },
];

export const fieldControltableColumns = [
  {
    id: "S.No",
    label: "S.No",
    minWidth: 100,
    align: "left",
  },
  {
    id: "name",
    label: "Name",
    minWidth: 200,
    align: "left",
  },
  {
    id: "action",
    label: "Action",
    minWidth: 200,
    align: "center",
  },
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

export const fieldControlformFields = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "fieldOptions", label: "Field Name", type: "text", required: true },
  { name: "fieldName", label: "Field Name", type: "text", required: true },
  { name: "Options", label: "Option 1", type: "text", required: true },
  { name: "Options", label: "Option 2", type: "text", required: true },
  { name: "Options", label: "Option 3", type: "text", required: true },

  //  {name: "options", label: "Option 1 ", type: "text", required: true },
  //  {name: "options", label: "Option 2 ", type: "text", required: true },
  //  {name: "options", label: "Option 3 ", type: "text", required: true },
  //  {name: "remarksrequired", label: "Remarks (if Required)", type: "toggle", required: true },
  //  {name: "photographrequired", label: "Photograph (if Required)", type: "toggle", required: true },
];

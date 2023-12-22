export const propertiestableColumns = [
   {
     id: "S.No",
     label: "S.No",
     minWidth: 70,
     align: "left",
   },
   {
    id: "nss",
    label: "Property id",
    minWidth: 140,
    align: "left",
  },
  {
    id: "name",
    label: "Property name",
    minWidth: 140,
    align: "left",
  },
   {
     id: "projectZone",
     label: "Project Location/Zone ",
     minWidth: 150,
     align: "left",
   },
   {
     id: "address",
     label: "Project Address",
     minWidth: 170,
     align: "left",
   },
   {
     id: "loanSanctionAmount",
     label: "Loan Sanction Amount",
     minWidth: 70,
     align: "left",
   },
   {
     id: "loadPOS",
     label: "Loan POS",
     minWidth: 70,
     align: "left",
   },
   {
     id: "groupSanctionAmount",
     label: "Group Sanction Amount",
     minWidth: 140,
     align: "center",
   },
   {
     id: "enddatetime",
     label: "Loan Account No.",
     minWidth: 140,
     align: "center",
   },
   {
     id: "groupPOS",
     label: "Group POS",
     minWidth: 100,
     align: "center",
   },
   {
    id: "city",
    label: "Borrower group",
    minWidth: 100,
    align: "center",
  },
   {
     id: "borrowerName",
     label: "Borrower Name",
     minWidth: 70,
     align: "center",
   },
   {
     id: "isActive",
     label: "Assigned Employee",
     minWidth: 70,
     align: "center",
   },
   {
     id: "isPublished",
     label: "Visit Dates",
     minWidth: 70,
     align: "center",
   },
  
 ];
 
 export const propertiesFormFields = [
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
 export const propertyformFields = [
  {name:"propertyId" , label:"Property Id",type:"text", required:true},
  { name: "projectName", label: "Project Name", type: "text", required: true },
  {name:"projectLocation" , label:"Project Location / Zone ",type:"text", required:true},
  {name:"address" , label:"Project Address",type:"text", required:true},
  {name:"loanSanctionAmount" , label:"Loan Sanction Amount",type:"number", required:true},
  {name:"loanPos" , label:"Loan POS",type:"number", required:true},
  {name:"groupSanctionAmount" , label:"Group Sanction Amount",type:"number", required:true},
  {name:"loanAccountNo" , label:"Loan Account No.",type:"text", required:true},
  {name:"groupPos" , label:"Group POS",type:"text", required:true},
  {name:"borrowerGroup" , label:"Borrower Group",type:"text", required:true},
  {name:"borrowerName" , label:"Borrower Name",type:"text", required:true},
  {name:"assignedEmployee" , label:"Assigned Employee",type:"text", required:true},
  {name:"visitDates" , label:"Visit Dates",type:"date", required:true},
  
];

export const  bulkUploadFields= [
  {
    name: "allTeamData",
    label: "Property Data ( .xlxs)",
    type: "file",
    required: true,
  },
  
];
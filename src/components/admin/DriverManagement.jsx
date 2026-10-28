import CrudSection, { StatusPill } from "./CrudSection";

const FIELDS = [
  { name: "full_name", label: "Full Name", required: true },
  { name: "phone", label: "Phone", type: "tel", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "license_number", label: "License Number", required: true },
  { name: "experience_years", label: "Experience (years)", type: "number", min: 0, required: true },
  { name: "status", label: "Status", type: "select", options: ["Available", "On Trip", "Unavailable"], default: "Available" },
  { name: "image", label: "Photo", type: "file" },
  { name: "address", label: "Address", type: "textarea", required: true },
];

const COLUMNS = [
  {
    label: "Photo",
    render: (d) => d.image ? <img className="admin-thumb" src={d.image} alt={d.full_name} /> : <span className="admin-thumb" />,
  },
  {
    label: "Driver",
    render: (d) => <><strong>{d.full_name}</strong><span className="admin-muted">{d.email}</span></>,
  },
  { label: "Phone", render: (d) => d.phone },
  { label: "License", render: (d) => d.license_number },
  { label: "Experience", render: (d) => `${d.experience_years} yrs` },
  { label: "Status", render: (d) => <StatusPill value={d.status} /> },
];

function DriverManagement() {

  return (
    <CrudSection
      title="Driver Management"
      subtitle="Manage drivers who can be assigned to bookings."
      endpoint="/drivers"
      itemLabel="Driver"
      fields={FIELDS}
      columns={COLUMNS}
    />
  );

}

export default DriverManagement;

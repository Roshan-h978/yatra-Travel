import { VEHICLE_TYPES } from "../../constants/vehicles";

import CrudSection, { StatusPill } from "./CrudSection";

const FIELDS = [
  { name: "name", label: "Vehicle Name", required: true },
  { name: "brand", label: "Brand", required: true },
  { name: "price_per_day", label: "Price Per Day (NPR)", type: "number", min: 0, required: true },
  { name: "seats", label: "Seats", type: "number", min: 1, required: true },
  { name: "vehicle_type", label: "Vehicle Type", type: "select", options: VEHICLE_TYPES, default: "SUV" },
  { name: "rental_type", label: "Rental Type", type: "select", options: ["Self Drive", "With Driver"], default: "Self Drive" },
  { name: "transmission", label: "Transmission", required: true },
  { name: "fuel_type", label: "Fuel Type", required: true },
  { name: "status", label: "Status", type: "select", options: ["Available", "Booked", "Maintenance"], default: "Available" },
  { name: "image", label: "Image", type: "file", required: true },
  { name: "description", label: "Description", type: "textarea", required: true },
];

const COLUMNS = [
  {
    label: "Image",
    render: (v) => v.image ? <img className="admin-thumb" src={v.image} alt={v.name} /> : <span className="admin-thumb" />,
  },
  {
    label: "Vehicle",
    render: (v) => <><strong>{v.name}</strong><span className="admin-muted">{v.brand}</span></>,
  },
  {
    label: "Type",
    render: (v) => <>{v.vehicle_type}<span className="admin-muted">{v.rental_type}</span></>,
  },
  {
    label: "Specs",
    render: (v) => <>{v.seats} seats<span className="admin-muted">{v.transmission} · {v.fuel_type}</span></>,
  },
  { label: "Price / Day", render: (v) => `NPR ${v.price_per_day.toLocaleString()}` },
  { label: "Status", render: (v) => <StatusPill value={v.status} /> },
];

function VehicleManagement() {

  return (
    <CrudSection
      title="Vehicle Management"
      subtitle="Add, edit and manage your rental fleet."
      endpoint="/vehicles"
      itemLabel="Vehicle"
      fields={FIELDS}
      columns={COLUMNS}
    />
  );

}

export default VehicleManagement;

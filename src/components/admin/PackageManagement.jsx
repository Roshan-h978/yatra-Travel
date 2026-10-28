import CrudSection from "./CrudSection";

const FIELDS = [
  { name: "title", label: "Package Title", required: true },
  { name: "location", label: "Location", required: true },
  { name: "duration", label: "Duration (e.g. 3 Days)", required: true },
  { name: "price", label: "Price (NPR)", type: "number", min: 0, required: true },
  { name: "rating", label: "Rating (0-5)", type: "number", step: "0.1", min: 0, max: 5, default: 5 },
  { name: "image", label: "Image", type: "file" },
  { name: "is_featured", label: "Featured package", type: "checkbox" },
  { name: "description", label: "Description", type: "textarea", required: true },
];

const COLUMNS = [
  {
    label: "Image",
    render: (p) => p.image ? <img className="admin-thumb" src={p.image} alt={p.title} /> : <span className="admin-thumb" />,
  },
  {
    label: "Package",
    render: (p) => <><strong>{p.title}</strong><span className="admin-muted">{p.location}</span></>,
  },
  { label: "Duration", render: (p) => p.duration },
  { label: "Price", render: (p) => `NPR ${p.price.toLocaleString()}` },
  { label: "Rating", render: (p) => `★ ${p.rating}` },
  { label: "Featured", render: (p) => (p.is_featured ? "Yes" : "No") },
];

function PackageManagement() {

  return (
    <CrudSection
      title="Package Management"
      subtitle="Create and manage tour packages shown on the website."
      endpoint="/packages"
      itemLabel="Package"
      fields={FIELDS}
      columns={COLUMNS}
    />
  );

}

export default PackageManagement;

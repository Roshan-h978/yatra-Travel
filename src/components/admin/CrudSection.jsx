import { useState } from "react";

import { FiEdit2, FiPlus, FiTrash2, FiX } from "react-icons/fi";

import API, { getErrorMessage } from "../../api/api";

import useAdminData from "./useAdminData";

/*
  Generic admin list + add / edit / delete section.

  Props:
    title, subtitle, endpoint ("/vehicles"), itemLabel ("Vehicle")
    fields:  [{ name, label, type: text|number|select|textarea|file|checkbox, options?, required?, full? }]
    columns: [{ label, render: (item) => node }]
*/

function emptyForm(fields) {

  return Object.fromEntries(
    fields.map((f) => [
      f.name,
      f.default ?? (f.type === "checkbox" ? false : f.type === "file" ? null : ""),
    ])
  );

}

export function StatusPill({ value }) {

  const key = String(value).toLowerCase().replace(/\s+/g, "-");

  return <span className={`admin-status admin-status--${key}`}>{value}</span>;

}

function CrudSection({ title, subtitle, endpoint, itemLabel, fields, columns }) {

  const { data: items, loading, error, reload } = useAdminData(`${endpoint}/`);

  const [formOpen, setFormOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(() => emptyForm(fields));

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState(null);

  function openAdd() {

    setEditingId(null);
    setFormData(emptyForm(fields));
    setMessage(null);
    setFormOpen(true);

  }

  function openEdit(item) {

    const values = emptyForm(fields);

    fields.forEach((f) => {
      // Images are only re-sent when a new file is chosen.
      if (f.type !== "file") values[f.name] = item[f.name] ?? values[f.name];
    });

    setEditingId(item.id);
    setFormData(values);
    setMessage(null);
    setFormOpen(true);

  }

  function closeForm() {

    setFormOpen(false);
    setEditingId(null);

  }

  function handleChange(e) {

    const { name, type, value, checked, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] || null : value,
    }));

  }

  async function handleSubmit(e) {

    e.preventDefault();

    setSaving(true);
    setMessage(null);

    const body = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      body.append(key, typeof value === "boolean" ? (value ? "true" : "false") : value);
    });

    try {

      if (editingId) {
        await API.put(`${endpoint}/update/${editingId}/`, body);
      } else {
        await API.post(`${endpoint}/add/`, body);
      }

      setMessage({ type: "success", text: `${itemLabel} ${editingId ? "updated" : "added"} successfully.` });
      closeForm();
      reload();

    } catch (err) {

      setMessage({ type: "error", text: getErrorMessage(err, `Could not save ${itemLabel.toLowerCase()}.`) });

    } finally {

      setSaving(false);

    }

  }

  async function handleDelete(item) {

    if (!window.confirm(`Delete this ${itemLabel.toLowerCase()}? This cannot be undone.`)) return;

    try {

      await API.delete(`${endpoint}/delete/${item.id}/`);
      setMessage({ type: "success", text: `${itemLabel} deleted.` });
      reload();

    } catch (err) {

      setMessage({ type: "error", text: getErrorMessage(err, "Delete failed.") });

    }

  }

  function renderField(f) {

    const common = {
      id: `crud-${f.name}`,
      name: f.name,
      onChange: handleChange,
      required: f.required && !(f.type === "file" && editingId),
    };

    let input;

    if (f.type === "select") {
      input = (
        <select {...common} value={formData[f.name]}>
          {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      );
    } else if (f.type === "textarea") {
      input = <textarea {...common} value={formData[f.name]} />;
    } else if (f.type === "file") {
      input = <input {...common} type="file" accept="image/*" />;
    } else if (f.type === "checkbox") {
      input = <input {...common} type="checkbox" checked={formData[f.name]} />;
    } else {
      input = (
        <input
          {...common}
          type={f.type || "text"}
          step={f.step}
          min={f.min}
          max={f.max}
          value={formData[f.name]}
        />
      );
    }

    const classes = [
      "admin-field",
      f.full || f.type === "textarea" ? "admin-field--full" : "",
      f.type === "checkbox" ? "admin-field--checkbox" : "",
    ].join(" ");

    return (
      <div className={classes} key={f.name}>
        <label htmlFor={common.id}>
          {f.label}{f.type === "file" && editingId ? " (leave empty to keep current)" : ""}
        </label>
        {input}
      </div>
    );

  }

  return (

    <section className="admin-section">

      <div className="admin-section-header">

        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>

        <button
          type="button"
          className="admin-btn admin-btn--primary"
          onClick={formOpen ? closeForm : openAdd}
        >
          {formOpen ? <><FiX aria-hidden="true" /> Close Form</> : <><FiPlus aria-hidden="true" /> Add {itemLabel}</>}
        </button>

      </div>

      {message && (
        <div className={`admin-alert admin-alert--${message.type}`} role="status">{message.text}</div>
      )}

      {formOpen && (

        <div className="admin-card">

          <h3>{editingId ? `Edit ${itemLabel}` : `Add ${itemLabel}`}</h3>

          <form key={editingId ?? "new"} className="admin-form" onSubmit={handleSubmit}>

            {fields.map(renderField)}

            <div className="admin-form-actions">

              <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Save Changes" : `Add ${itemLabel}`}
              </button>

              <button type="button" className="admin-btn admin-btn--ghost" onClick={closeForm}>
                Cancel
              </button>

            </div>

          </form>

        </div>

      )}

      <div className="admin-table-wrap">

        <table className="admin-table">

          <thead>
            <tr>
              {columns.map((c) => <th key={c.label}>{c.label}</th>)}
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading && (
              <tr><td className="admin-table-empty" colSpan={columns.length + 1}>Loading...</td></tr>
            )}

            {!loading && error && (
              <tr>
                <td className="admin-table-empty" colSpan={columns.length + 1}>
                  {error}{" "}
                  <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={reload}>Retry</button>
                </td>
              </tr>
            )}

            {!loading && !error && items.length === 0 && (
              <tr><td className="admin-table-empty" colSpan={columns.length + 1}>No {itemLabel.toLowerCase()}s yet.</td></tr>
            )}

            {!loading && !error && items.map((item) => (

              <tr key={item.id}>

                {columns.map((c) => <td key={c.label} data-label={c.label}><div className="admin-cell">{c.render(item)}</div></td>)}

                <td data-label="Actions">
                  <div className="admin-cell admin-actions">
                    <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => openEdit(item)}>
                      <FiEdit2 aria-hidden="true" /> Edit
                    </button>
                    <button type="button" className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => handleDelete(item)}>
                      <FiTrash2 aria-hidden="true" /> Delete
                    </button>
                  </div>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </section>

  );

}

export default CrudSection;

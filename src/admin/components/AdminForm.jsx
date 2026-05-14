function AdminForm({
  fields,
  formData,
  errors,
  onChange,
  onSubmit,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  onCancel,
  layout = "vertical",
  beforeActions = null
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const formGridClass = layout === "horizontal"
    ? "grid grid-cols-1 md:grid-cols-2 gap-4"
    : "space-y-4";

  return (
    <form onSubmit={handleSubmit} className={formGridClass}>
      {fields.map((field) => (
        <div key={field.name} className={field.fullWidth ? "md:col-span-2" : ""}>
          <label className="block text-sm font-semibold text-gray-300 mb-1 tracking-wide">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {field.type === "textarea" ? (
            <textarea
              name={field.name}
              value={formData[field.name] || ""}
              onChange={onChange}
              placeholder={field.placeholder}
              className={`w-full px-4 py-3 bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 hover:border-white/30 transition-all text-white placeholder-gray-500 shadow-inner shadow-black/10 ${
                errors[field.name] ? "border-red-500" : "border-white/10"
              }`}
              rows={field.rows || 3}
            />
          ) : field.type === "select" ? (
            <select
              name={field.name}
              value={formData[field.name] || ""}
              onChange={onChange}
              className={`w-full px-4 py-3 bg-[#0f172a] border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 hover:border-white/30 transition-all text-white placeholder-gray-500 appearance-none shadow-inner shadow-black/10 cursor-pointer ${
                errors[field.name] ? "border-red-500" : "border-white/10"
              }`}
            >
              <option value="" className="text-gray-500">Select {field.label}</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value} className="bg-gray-800">
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type || "text"}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={onChange}
              placeholder={field.placeholder}
              className={`w-full px-4 py-3 bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 hover:border-white/30 transition-all text-white placeholder-gray-500 shadow-inner shadow-black/10 ${
                errors[field.name] ? "border-red-500" : "border-white/10"
              }`}
            />
          )}

          {errors[field.name] && (
            <p className="text-red-500 text-sm mt-1.5 font-medium">{errors[field.name]}</p>
          )}
        </div>
      ))}

      {beforeActions && (
        <div className={layout === "horizontal" ? "md:col-span-2" : ""}>
          {beforeActions}
        </div>
      )}

      <div className={`flex justify-end space-x-3 pt-6 mt-4 border-t border-white/10 ${layout === "horizontal" ? "md:col-span-2" : ""}`}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 text-gray-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-colors font-medium cursor-pointer"
          >
            {cancelLabel}
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 hover:shadow-red-500/50 hover:from-red-500 hover:to-red-700 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export default AdminForm;
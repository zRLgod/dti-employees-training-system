export default function InputField({ label, name, type = "text", value, onChange, required, autoFocus }) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-2 border rounded"
          required={required}
          autoFocus={autoFocus}
        />
      </div>
    );
  }
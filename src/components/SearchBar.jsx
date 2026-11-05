export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <input
      className="search"
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label="Search rides"
    />
  );
}
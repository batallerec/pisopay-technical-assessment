const filters = [
  { value: 'all', label: 'All tasks' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
];

export default function TaskFilters({ filter, onFilterChange }) {
  return (
    <div className="flex w-fit max-w-full overflow-x-auto rounded-xl border border-[#d7ded5] bg-white p-1 shadow-sm" aria-label="Task filters">
      {filters.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`cursor-pointer whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition sm:px-4 ${
            filter === option.value
              ? 'bg-[#36A8FF] text-white shadow-sm hover:bg-[#178fe5]'
              : 'text-[#5d6b63] hover:bg-[#eef3ed] hover:text-[#173c2e]'
          }`}
          onClick={() => onFilterChange(option.value)}
          aria-pressed={filter === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
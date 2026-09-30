function Stat({ label, value, accent }) {
  return (
    <div className="flex min-h-40 flex-col rounded-2xl border border-[#dce4da] bg-white px-5 py-4 shadow-[0_10px_30px_rgba(38,61,47,0.05)]">
      <div className={`mb-3 h-1.5 w-10 rounded-full ${accent}`} />
      <p className="min-h-10 text-sm font-medium leading-5 text-[#68776d]">{label}</p>
      <p className="mt-auto text-3xl font-semibold tracking-tight text-[#173c2e]">{value}</p>
    </div>
  );
}

export default function TaskStats({ tasks }) {
  const completedTasks = tasks.filter((task) => task.status === 'completed').length;
  const pendingTasks = tasks.filter((task) => task.status === 'pending').length;

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Task statistics">
      <Stat label="Total tasks" value={tasks.length} accent="bg-[#173c2e]" />
      <Stat label="Pending" value={pendingTasks} accent="bg-[#ed9b3a]" />
      <Stat label="Completed" value={completedTasks} accent="bg-[#58a478]" />
    </section>
  );
}
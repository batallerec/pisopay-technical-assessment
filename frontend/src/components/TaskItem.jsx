function formatDate(dateValue) {
  if (!dateValue) {
    return 'Date unavailable';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateValue));
}

const priorityStyles = {
  high: 'bg-[#fff0ed] text-[#b84c3d]',
  medium: 'bg-[#fff5df] text-[#a36b13]',
  low: 'bg-[#e9f4eb] text-[#3b8058]',
};

export default function TaskItem({ task, actionInProgress, onComplete, onDelete }) {
  const isCompleting = actionInProgress?.id === task.id && actionInProgress.type === 'complete';
  const isDeleting = actionInProgress?.id === task.id && actionInProgress.type === 'delete';
  const isBusy = Boolean(actionInProgress?.id === task.id);

  return (
    <article className="rounded-2xl border border-[#dce4da] bg-white p-5 shadow-[0_10px_30px_rgba(38,61,47,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(38,61,47,0.09)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${priorityStyles[task.priority] || priorityStyles.low}`}>
              {task.priority || 'unknown'} priority
            </span>
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
              task.status === 'completed' ? 'bg-[#e9f4eb] text-[#3b8058]' : 'bg-[#fff5df] text-[#a36b13]'
            }`}>
              {task.status}
            </span>
          </div>
          <h3 className={`break-words text-lg font-semibold ${task.status === 'completed' ? 'text-[#829087] line-through' : 'text-[#173c2e]'}`}>
            {task.title}
          </h3>
          {task.description && <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[#68776d]">{task.description}</p>}
          <p className="mt-4 text-xs font-medium text-[#8a968d]">Created {formatDate(task.created_at)}</p>
        </div>

        <div className="flex shrink-0 gap-2 sm:flex-col">
          {task.status === 'pending' && (
            <button
              type="button"
              onClick={() => onComplete(task.id)}
              disabled={isBusy}
              className="rounded-lg border border-[#a9c5b0] px-3 py-2 text-xs font-bold text-[#2d6847] transition hover:bg-[#edf6ef] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCompleting ? 'Completing...' : 'Complete'}
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            disabled={isBusy}
            className="rounded-lg border border-[#efc1b8] px-3 py-2 text-xs font-bold text-[#b84c3d] transition hover:bg-[#fff0ed] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </article>
  );
}
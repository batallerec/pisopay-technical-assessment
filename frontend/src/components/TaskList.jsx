import TaskItem from './TaskItem';

export default function TaskList({ tasks, actionInProgress, onComplete, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#bfcfc1] bg-[#f8fbf7] px-6 py-14 text-center">
        <p className="text-lg font-semibold text-[#315640]">Nothing here yet</p>
        <p className="mt-2 text-sm text-[#718077]">Create a task or choose another filter.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          actionInProgress={actionInProgress}
          onComplete={onComplete}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
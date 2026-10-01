import { useEffect, useState } from 'react';
import TaskFilters from './components/TaskFilters';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskStats from './components/TaskStats';
import { completeTask, deleteTask, getTasks } from './services/taskApi';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTasks() {
      setLoading(true);
      setError(null);

      try {
        const loadedTasks = await getTasks(filter, controller.signal);
        setTasks(Array.isArray(loadedTasks) ? loadedTasks : []);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadTasks();

    return () => controller.abort();
  }, [filter, refreshKey]);

  async function handleComplete(taskId) {
    setActionInProgress({ id: taskId, type: 'complete' });
    setError(null);

    try {
      const updatedTask = await completeTask(taskId);
      setTasks((currentTasks) => currentTasks.map((task) => (
        task.id === taskId ? updatedTask : task
      )));
    } catch (requestError) {
      setError(requestError);
    } finally {
      setActionInProgress(null);
    }
  }

  async function handleDelete(taskId) {
    setActionInProgress({ id: taskId, type: 'delete' });
    setError(null);

    try {
      await deleteTask(taskId);
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
    } catch (requestError) {
      setError(requestError);
    } finally {
      setActionInProgress(null);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e4f0e1_0%,transparent_34%),#f5f7f2] text-[#17211d]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 border-b border-[#d6dfd5] pb-5 lg:mb-8 lg:flex-row lg:items-end lg:justify-between lg:gap-5 lg:pb-7">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#36A8FF]">Simple task tracker</p>
            <h1 className="max-w-xl text-3xl font-semibold tracking-tight text-[#173c2e] sm:text-4xl lg:text-5xl">Make room for what matters.</h1>
            <p className="mt-3 max-w-lg text-base leading-7 text-[#68776d]">A clear place for today&apos;s work, one thoughtful task at a time.</p>
          </div>
          <div className="w-fit shrink-0 rounded-xl border border-[#d7ded5] bg-white px-4 py-3 text-sm text-[#53645a] shadow-sm">
            <span className="relative mr-2 inline-flex h-2.5 w-2.5 items-center justify-center" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#58a478] opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-[#3b8058] shadow-[0_0_8px_#58a478] motion-safe:animate-[pulse_1.8s_ease-in-out_infinite]" />
            </span>
            {loading ? 'Syncing tasks' : error ? 'Connection issue' : 'Tasks in sync'}
          </div>
        </header>

        {error && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-[#efc1b8] bg-[#fff0ed] px-4 py-3 text-sm text-[#a54235]" role="alert">
            <span>{error.message}</span>
            <button type="button" className="cursor-pointer font-bold underline" onClick={() => setRefreshKey((key) => key + 1)}>Retry</button>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <section className="order-2 space-y-5 lg:order-1">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-medium text-[#718077]">Your workspace</p>
                <h2 className="text-2xl font-semibold text-[#173c2e]">Task list</h2>
              </div>
              <TaskFilters filter={filter} onFilterChange={setFilter} />
            </div>

            {loading ? (
              <div className="rounded-2xl border border-[#dce4da] bg-white px-6 py-16 text-center shadow-[0_10px_30px_rgba(38,61,47,0.05)]">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#dce4da] border-t-[#e07f3f]" aria-label="Loading" />
                <p className="mt-4 text-sm text-[#718077]">Loading tasks...</p>
              </div>
            ) : (
              <TaskList
                tasks={tasks}
                actionInProgress={actionInProgress}
                onComplete={handleComplete}
                onDelete={handleDelete}
              />
            )}
          </section>

          <aside className="order-1 space-y-5 lg:sticky lg:top-6 lg:order-2 lg:self-start">
            <TaskForm onTaskCreated={() => setRefreshKey((key) => key + 1)} />
            <TaskStats tasks={tasks} />
          </aside>
        </div>
      </div>
    </main>
  );
}
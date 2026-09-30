import { useState } from 'react';
import { createTask } from '../services/taskApi';

const initialForm = {
  title: '',
  description: '',
  priority: 'medium',
};

export default function TaskForm({ onTaskCreated }) {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setError(null);
    setSuccess(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await createTask(form);
      setForm(initialForm);
      setSuccess(true);
      onTaskCreated();
    } catch (requestError) {
      setError(requestError);
    } finally {
      setIsSubmitting(false);
    }
  }

  const validationErrors = error?.details?.errors || {};

  return (
    <section className="rounded-2xl border border-[#dce4da] bg-white p-5 shadow-[0_10px_30px_rgba(38,61,47,0.05)] sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e07f3f]">New task</p>
        <h2 className="mt-1 text-xl font-semibold text-[#173c2e]">Put something on your list</h2>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[#405148]" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            maxLength={255}
            placeholder="e.g. Review API response handling"
            className="w-full rounded-xl border border-[#cfd9d0] bg-[#fbfcfa] px-3.5 py-2.5 text-sm text-[#173c2e] outline-none transition placeholder:text-[#9ba79f] focus:border-[#477d62] focus:ring-4 focus:ring-[#dfece2]"
          />
          {validationErrors.title?.map((message) => (
            <p className="mt-1 text-sm text-[#b84c3d]" key={message}>{message}</p>
          ))}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[#405148]" htmlFor="description">
            Description <span className="font-normal text-[#8a968d]">(optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            placeholder="Add useful context"
            className="w-full resize-y rounded-xl border border-[#cfd9d0] bg-[#fbfcfa] px-3.5 py-2.5 text-sm text-[#173c2e] outline-none transition placeholder:text-[#9ba79f] focus:border-[#477d62] focus:ring-4 focus:ring-[#dfece2]"
          />
          {validationErrors.description?.map((message) => (
            <p className="mt-1 text-sm text-[#b84c3d]" key={message}>{message}</p>
          ))}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[#405148]" htmlFor="priority">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#cfd9d0] bg-[#fbfcfa] px-3.5 py-2.5 text-sm text-[#173c2e] outline-none transition focus:border-[#477d62] focus:ring-4 focus:ring-[#dfece2]"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {validationErrors.priority?.map((message) => (
            <p className="mt-1 text-sm text-[#b84c3d]" key={message}>{message}</p>
          ))}
        </div>

        {error && !error.details?.errors && (
          <p className="rounded-xl bg-[#fff0ed] px-3 py-2 text-sm text-[#a54235]" role="alert">
            {error.message}
          </p>
        )}
        {success && <p className="text-sm font-medium text-[#3b8058]">Task added to your list.</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-[#e07f3f] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#c9682f] focus:outline-none focus:ring-4 focus:ring-[#f6d7c4] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Adding task...' : 'Add task'}
        </button>
      </form>
    </section>
  );
}
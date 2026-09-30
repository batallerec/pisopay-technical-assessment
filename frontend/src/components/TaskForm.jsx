import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { createTask } from '../services/taskApi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useToast } from './ui/toast';

const initialForm = {
  title: '',
  description: '',
  priority: 'medium',
};

export default function TaskForm({ onTaskCreated }) {
  const { toast } = useToast();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setError(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await createTask(form);
      setForm(initialForm);
      toast({
        title: 'Task added successfully!',
        description: 'Your new task is ready to go.',
      });
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
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#36A8FF]">New task</p>
        <h2 className="mt-1 text-xl font-semibold text-[#173c2e]">Put something on your list</h2>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[#405148]" htmlFor="title">
            Title <span className="text-[#d64b3f]" aria-hidden="true">*</span>
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
          <span className="mb-1.5 block text-sm font-semibold text-[#405148]">
            Priority
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                id="priority"
                type="button"
                className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-[#cfd9d0] bg-[#fbfcfa] px-3.5 py-2.5 text-left text-sm capitalize text-[#173c2e] outline-none transition hover:border-[#a9c5b0] focus:border-[#477d62] focus:ring-4 focus:ring-[#dfece2]"
                aria-label="Priority"
              >
                {form.priority}
                <span className="text-[#718077]">⌄</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)]">
              <DropdownMenuRadioGroup
                value={form.priority}
                onValueChange={(priority) => {
                  setForm((currentForm) => ({ ...currentForm, priority }));
                  setError(null);
                }}
              >
                <DropdownMenuRadioItem value="low">Low</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="medium">Medium</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="high">High</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {validationErrors.priority?.map((message) => (
            <p className="mt-1 text-sm text-[#b84c3d]" key={message}>{message}</p>
          ))}
        </div>

        {error && !error.details?.errors && (
          <p className="rounded-xl bg-[#fff0ed] px-3 py-2 text-sm text-[#a54235]" role="alert">
            {error.message}
          </p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#36A8FF] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#178fe5] focus:outline-none focus:ring-4 focus:ring-[#c9eaff] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span>{isSubmitting ? 'Adding task...' : 'Add task'}</span>
          {!isSubmitting && <ArrowRight className="size-5 transition-transform duration-300 ease-out group-hover:translate-x-1.5" aria-hidden="true" />}
        </button>
      </form>
    </section>
  );
}
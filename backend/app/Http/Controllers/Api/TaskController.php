<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Support\TaskSorter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TaskController
{
    public function index(Request $request): JsonResponse
    {
        $status = $request->query('status');

        if ($status !== null && ! in_array($status, ['pending', 'completed'], true)) {
            return response()->json(['message' => 'Invalid status filter'], 400);
        }

        $query = Task::query();

        if ($status !== null) {
            $query->where('status', $status);
        }

        $tasks = $query->get()
            ->map(static fn (Task $task): array => $task->toArray())
            ->all();

        $sortedTasks = (new TaskSorter())->sortTasks($tasks);

        return response()->json($sortedTasks, 200);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => [
                'required',
                'string',
                'max:255',
                function (string $attribute, mixed $value, callable $fail): void {
                    if (! is_string($value) || trim($value) === '') {
                        $fail('The title field must not be empty.');
                    }
                },
            ],
            'description' => ['nullable', 'string'],
            'priority' => ['sometimes', 'in:low,medium,high'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 400);
        }

        $validated = $validator->validated();
        $validated['title'] = trim($validated['title']);

        $task = Task::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'priority' => $validated['priority'] ?? 'medium',
            'status' => 'pending',
        ]);

        return response()->json($task, 201);
    }

    public function complete($id): JsonResponse
    {
        $task = Task::find($id);

        if ($task === null) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        $task->status = 'completed';
        $task->save();

        return response()->json($task, 200);
    }

    public function destroy($id): JsonResponse
    {
        $task = Task::find($id);

        if ($task === null) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted'], 200);
    }
}
<?php

namespace Tests\Feature;

use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_creates_task(): void
    {
        $response = $this->postJson('/api/tasks', [
            'title' => 'Write tests',
            'description' => 'Cover the task API.',
            'priority' => 'high',
        ]);

        $response
            ->assertStatus(201)
            ->assertJsonPath('title', 'Write tests')
            ->assertJsonPath('priority', 'high')
            ->assertJsonPath('status', 'pending');

        $this->assertDatabaseHas('tasks', [
            'title' => 'Write tests',
            'status' => 'pending',
        ]);
    }

    public function test_rejects_missing_or_empty_title(): void
    {
        $missingTitleResponse = $this->postJson('/api/tasks', []);
        $emptyTitleResponse = $this->postJson('/api/tasks', ['title' => '   ']);

        $missingTitleResponse
            ->assertStatus(400)
            ->assertJsonValidationErrors(['title']);
        $emptyTitleResponse
            ->assertStatus(400)
            ->assertJsonValidationErrors(['title']);
    }

    public function test_rejects_invalid_priority(): void
    {
        $this->postJson('/api/tasks', [
            'title' => 'Invalid priority task',
            'priority' => 'urgent',
        ])
            ->assertStatus(400)
            ->assertJsonValidationErrors(['priority']);
    }

    public function test_rejects_invalid_status_filter(): void
    {
        $this->getJson('/api/tasks?status=archived')
            ->assertStatus(400)
            ->assertJson(['message' => 'Invalid status filter']);
    }

    public function test_completes_task(): void
    {
        $task = Task::create(['title' => 'Finish API', 'status' => 'pending']);

        $response = $this->patchJson("/api/tasks/{$task->id}/complete");

        $response
            ->assertStatus(200)
            ->assertJsonPath('status', 'completed');
        $this->assertDatabaseHas('tasks', ['id' => $task->id, 'status' => 'completed']);
    }

    public function test_returns_not_found_when_completing_missing_task(): void
    {
        $this->patchJson('/api/tasks/999/complete')
            ->assertStatus(404)
            ->assertJson(['message' => 'Task not found']);
    }

    public function test_deletes_task(): void
    {
        $task = Task::create(['title' => 'Remove API draft']);

        $this->deleteJson("/api/tasks/{$task->id}")
            ->assertStatus(200)
            ->assertJson(['message' => 'Task deleted']);

        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    public function test_returns_not_found_when_deleting_missing_task(): void
    {
        $this->deleteJson('/api/tasks/999')
            ->assertStatus(404)
            ->assertJson(['message' => 'Task not found']);
    }

    public function test_filters_tasks_by_status(): void
    {
        Task::create(['title' => 'Pending task', 'status' => 'pending']);
        Task::create(['title' => 'Completed task', 'status' => 'completed']);

        $this->getJson('/api/tasks?status=pending')
            ->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment(['title' => 'Pending task']);

        $this->getJson('/api/tasks?status=completed')
            ->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment(['title' => 'Completed task']);
    }
}
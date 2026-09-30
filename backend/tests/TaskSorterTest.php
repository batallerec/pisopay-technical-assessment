<?php

declare(strict_types=1);

namespace Tests;

use App\Support\TaskSorter;
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../src/TaskSorter.php';

final class TaskSorterTest extends TestCase
{
    public function testSortsTasksByPriority(): void
    {
        $tasks = [
            ['title' => 'Low task', 'priority' => 'low', 'created_at' => 100],
            ['title' => 'High task', 'priority' => 'high', 'created_at' => 300],
            ['title' => 'Medium task', 'priority' => 'medium', 'created_at' => 200],
        ];

        $sortedTasks = (new TaskSorter())->sortTasks($tasks);

        $this->assertSame(
            ['High task', 'Medium task', 'Low task'],
            array_column($sortedTasks, 'title'),
        );
    }

    public function testSortsOlderTasksFirstWhenPrioritiesMatch(): void
    {
        $tasks = [
            ['title' => 'Newest task', 'priority' => 'high', 'created_at' => '2026-01-15'],
            ['title' => 'Oldest task', 'priority' => 'high', 'created_at' => '2025-01-15'],
            ['title' => 'Middle task', 'priority' => 'high', 'created_at' => 1760000000],
        ];

        $sortedTasks = (new TaskSorter())->sortTasks($tasks);

        $this->assertSame(
            ['Oldest task', 'Middle task', 'Newest task'],
            array_column($sortedTasks, 'title'),
        );
    }

    public function testDoesNotModifyOriginalTasksAndHandlesEmptyInput(): void
    {
        $tasks = [
            ['title' => 'Unknown priority', 'created_at' => 'not-a-date'],
            ['title' => 'Low task', 'priority' => 'low', 'created_at' => 100],
        ];
        $originalTasks = $tasks;

        $sortedTasks = (new TaskSorter())->sortTasks($tasks);

        $this->assertSame($originalTasks, $tasks);
        $this->assertSame([], (new TaskSorter())->sortTasks([]));
        $this->assertSame(['Low task', 'Unknown priority'], array_column($sortedTasks, 'title'));
    }
}
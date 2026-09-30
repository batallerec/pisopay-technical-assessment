<?php

declare(strict_types=1);

namespace App\Support;

final class TaskSorter
{
    public function sortTasks(array $tasks): array
    {
        $sortableTasks = [];

        foreach (array_values($tasks) as $index => $task) {
            $sortableTasks[] = [
                'task' => $task,
                'index' => $index,
            ];
        }

        usort($sortableTasks, function (array $left, array $right): int {
            $leftTask = is_array($left['task']) ? $left['task'] : [];
            $rightTask = is_array($right['task']) ? $right['task'] : [];

            $priorityComparison = $this->priorityWeight($rightTask['priority'] ?? null)
                <=> $this->priorityWeight($leftTask['priority'] ?? null);

            if ($priorityComparison !== 0) {
                return $priorityComparison;
            }

            $dateComparison = $this->compareCreatedAt(
                $leftTask['created_at'] ?? null,
                $rightTask['created_at'] ?? null,
            );

            if ($dateComparison !== 0) {
                return $dateComparison;
            }

            return $left['index'] <=> $right['index'];
        });

        return array_column($sortableTasks, 'task');
    }

    private function priorityWeight(mixed $priority): int
    {
        return match (is_string($priority) ? strtolower($priority) : null) {
            'high' => 3,
            'medium' => 2,
            'low' => 1,
            default => 0,
        };
    }

    private function compareCreatedAt(mixed $leftCreatedAt, mixed $rightCreatedAt): int
    {
        $leftTimestamp = $this->timestamp($leftCreatedAt);
        $rightTimestamp = $this->timestamp($rightCreatedAt);

        if ($leftTimestamp === null && $rightTimestamp === null) {
            return 0;
        }

        if ($leftTimestamp === null) {
            return 1;
        }

        if ($rightTimestamp === null) {
            return -1;
        }

        return $leftTimestamp <=> $rightTimestamp;
    }

    private function timestamp(mixed $createdAt): ?int
    {
        if (is_int($createdAt)) {
            return $createdAt;
        }

        if (is_float($createdAt)) {
            return (int) $createdAt;
        }

        if (!is_string($createdAt) || trim($createdAt) === '') {
            return null;
        }

        if (is_numeric($createdAt)) {
            return (int) $createdAt;
        }

        $timestamp = strtotime($createdAt);

        return $timestamp === false ? null : $timestamp;
    }
}
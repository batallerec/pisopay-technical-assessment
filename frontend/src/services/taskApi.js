const API_URL = '/api/tasks';

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.message || 'The request failed.');
    error.status = response.status;
    error.details = data;
    throw error;
  }

  return data;
}

export function getTasks(filter = 'all', signal) {
  const query = filter === 'all' ? '' : `?status=${filter}`;

  return request(`${API_URL}${query}`, { signal });
}

export function createTask(task) {
  return request(API_URL, {
    method: 'POST',
    body: JSON.stringify(task),
  });
}

export function completeTask(taskId) {
  return request(`${API_URL}/${taskId}/complete`, {
    method: 'PATCH',
  });
}

export function deleteTask(taskId) {
  return request(`${API_URL}/${taskId}`, {
    method: 'DELETE',
  });
}
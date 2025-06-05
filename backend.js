// 模拟后端逻辑 - 使用localStorage作为数据存储

// 获取所有任务
function getAllTasksFromBackend() {
    const tasksJson = localStorage.getItem('tasks');
    return tasksJson ? JSON.parse(tasksJson) : [];
}

// 添加新任务
function addTaskToBackend(task) {
    const tasks = getAllTasksFromBackend();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 切换任务完成状态
function toggleTaskCompletionInBackend(taskId) {
    const tasks = getAllTasksFromBackend();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

// 删除任务
function deleteTaskFromBackend(taskId) {
    const tasks = getAllTasksFromBackend();
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(filteredTasks));
}

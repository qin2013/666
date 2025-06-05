// 前端应用逻辑

// 初始化 - 页面加载时显示所有任务
document.addEventListener('DOMContentLoaded', function() {
    refreshTaskList();
});

// 添加新任务
function addTask() {
    const input = document.getElementById('taskInput');
    const title = input.value.trim();
    
    if (title) {
        const newTask = {
            id: Date.now(), // 使用时间戳作为简单ID
            title: title,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        // 调用"后端"添加任务
        addTaskToBackend(newTask);
        input.value = ''; // 清空输入框
        refreshTaskList(); // 刷新任务列表
    }
}

// 刷新任务列表
function refreshTaskList() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    // 从"后端"获取所有任务
    const tasks = getAllTasksFromBackend();
    
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task ${task.completed ? 'completed' : ''}`;
        
        taskElement.innerHTML = `
            <span>${task.title}</span>
            <div>
                <button onclick="toggleTaskCompletion(${task.id})">
                    ${task.completed ? '标记未完成' : '标记完成'}
                </button>
                <button onclick="deleteTask(${task.id})">删除</button>
            </div>
        `;
        
        taskList.appendChild(taskElement);
    });
}

// 切换任务完成状态
function toggleTaskCompletion(taskId) {
    toggleTaskCompletionInBackend(taskId);
    refreshTaskList();
}

// 删除任务
function deleteTask(taskId) {
    deleteTaskFromBackend(taskId);
    refreshTaskList();
}

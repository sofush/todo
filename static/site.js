const updateSubtitle = () => {
    const incompleteTasks = document.querySelectorAll('.task-container:not(.completed)');
    const completeTasks = document.querySelectorAll('.task-container.completed');
    const subtitle = document.getElementById('subtitle');
    
    if (incompleteTasks.length > 0)
        subtitle.innerHTML = `You have ${incompleteTasks.length} incomplete tasks.`;
    else if (incompleteTasks.length == 0 && completeTasks.length > 0)
        subtitle.innerHTML = `You have completed all your tasks!`;
    else
        subtitle.innerHTML = 'You have not added any tasks.';

};

const toggleCompleted = async (taskContainerDiv, taskId) => {
    const res = await fetch(`/toggle/${taskId}`, { method: 'PATCH' });

    if (res.status !== 204) {
        return;
    }

    taskContainerDiv.classList.toggle('completed');
    updateSubtitle();
};

const deleteTask = async (taskContainerDiv, taskId) => {
    const res = await fetch(`/delete/${taskId}`, { method: 'DELETE' });

    if (res.status !== 204)
        return;

    taskContainerDiv.remove();
    updateSubtitle();
};

const addTaskElement = (taskJson) => {
    const container = document.getElementById('container');
    const form = document.getElementById('form');
    const taskContainer = document.createElement('div');
    
    const indexHtml = `<div class="task-index">${taskJson.id})</div>`;
    const descHtml = `<div class="task">${taskJson.description}</div>`;
    const spaceHtml = `<div style="flex: 1"></div>`;
    const deleteHtml = `<div class="task-delete"><i class="fa-solid fa-trash fa-fw"></i></div>`;

    taskContainer.innerHTML = indexHtml + descHtml + spaceHtml + deleteHtml;
    container.insertBefore(taskContainer, form);
    taskContainer.classList.add('task-container');

    const taskElement = taskContainer.getElementsByClassName('task')[0];
    const deleteElement = taskContainer.getElementsByClassName('task-delete')[0];
    const taskId = taskJson.id;

    taskElement.addEventListener('click', async _ => await toggleCompleted(taskContainer, taskId));
    deleteElement.addEventListener('click', async _ => await deleteTask(taskContainer, taskId));
};

// Load tasks and insert HTML elements
document.addEventListener('DOMContentLoaded', async _ => {
    const response = await fetch('/tasks');
    if (!response.ok) return;
    
    const tasks = await response.json();

    for (const task of tasks)
        addTaskElement(task);
    
    updateSubtitle(tasks.length);
});

// Event handling for "add task" form
document.addEventListener('DOMContentLoaded', async _ => {
    const button = document.getElementById('button');
    const textfield = document.getElementById('textfield');
    
    const handleSubmission = async _ => {
        const res = await fetch(`/add/${textfield.value}`, { method: 'POST' });

        if (res.status !== 200)
            return;

        const task = await res.json();
        textfield.value = '';
        addTaskElement(task);
        updateSubtitle();
    };
    
    button.addEventListener('click', handleSubmission);
    textfield.addEventListener('keydown', e => {
        if (e.key === 'Enter')
            handleSubmission();
    });
});
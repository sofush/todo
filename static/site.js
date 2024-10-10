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

    taskElement.addEventListener('click', async _ => {
        const res = await fetch(`/toggle/${taskJson.id}`, { method: 'PATCH' });

        if (res.status !== 204) {
            return;
        }

        taskContainer.classList.toggle('completed')
        updateSubtitle();
    });
    
    const deleteElement = taskContainer.getElementsByClassName('task-delete')[0];
    
    deleteElement.addEventListener('click', async _ => {
        const res = await fetch(`/delete/${taskJson.id}`, { method: 'DELETE' });

        if (res.status !== 204)
            return;

        taskContainer.remove();
        updateSubtitle();
    });
};

const updateSubtitle = () => {
    const tasks = document.getElementsByClassName('task-container');
    document.getElementById('subtitle').innerHTML =
        tasks.length + ' tasks so far...';
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
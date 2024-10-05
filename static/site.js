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

    taskElement.addEventListener('click', _ => {
        fetch('/toggle/' + taskJson.id, { method: 'post' })
        .then(response => {
            if (response.status !== 200)
                return;

            taskContainer.classList.toggle('completed')
            updateSubtitle();
        });
    });
    
    const deleteElement = taskContainer.getElementsByClassName('task-delete')[0];
    
    deleteElement.addEventListener('click', _ => {
        fetch('/delete/' + taskJson.id, { method: 'post' })
        .then(response => {
            if (response.status !== 200)
                return;

            taskContainer.remove();
            updateSubtitle();
        });
    });
};

const updateSubtitle = () => {
    const tasks = document.getElementsByClassName('task-container');
    document.getElementById('subtitle').innerHTML =
        tasks.length + ' tasks so far...';
};

// Load tasks and insert HTML elements
document.addEventListener('DOMContentLoaded', async e => {
    const response = await fetch('/tasks');
    if (!response.ok) return;
    
    const tasks = await response.json();

    Array.from(tasks).forEach(task => {
        addTaskElement(task);
    });
    
    updateSubtitle(tasks.length);
});

// Event handling for "add task" form
document.addEventListener('DOMContentLoaded', async _ => {
    const button = document.getElementById('button');
    const textfield = document.getElementById('textfield');
    
    const handleSubmission = _ => {
        fetch('/add/' + textfield.value, { method: 'post' })
        .then(async response => {
            if (response.status !== 200)
                return;

            const task = await response.json();
            textfield.value = '';
            addTaskElement(task);
            updateSubtitle();
        });
    };
    
    button.addEventListener('click', handleSubmission);
    textfield.addEventListener('keydown', e => {
        if (e.key === 'Enter')
            handleSubmission();
    });
});
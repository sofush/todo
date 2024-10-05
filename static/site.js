const addTaskElement = (task) => {
    const container = document.getElementById('container');
    const form = document.getElementById('form');
    const taskContainer = document.createElement('div');
    
    const indexHtml = `<div class="task-index">${task.id})</div>`;
    const descHtml = `<div class="task">${task.description}</div>`;
    const spaceHtml = `<div style="flex: 1"></div>`;
    const deleteHtml = `<div class="task-delete"><i class="fa-solid fa-trash fa-fw"></i></div>`;

    taskContainer.innerHTML = indexHtml + descHtml + spaceHtml + deleteHtml;
    container.insertBefore(taskContainer, form);
    taskContainer.classList.add('task-container');
};

// Load tasks and insert HTML elements
document.addEventListener('DOMContentLoaded', async e => {
    const response = await fetch('/tasks');
    if (!response.ok) return;
    
    const json = await response.json();

    Array.from(json).forEach(task => {
        addTaskElement(task);
    });
    
    const containers = document.getElementsByClassName('task-container');
    
    Array.from(containers).forEach(container => {
        const inner = container.getElementsByClassName('task');
        const index = container.getElementsByClassName('task-index')[0];
        
        if (inner.length < 1 || index.length < 1) return;

        inner[0].addEventListener('click', _ => {
            fetch('/toggle/' + index.innerHTML.replace(')', ''), {
                method: 'post',
            }).then(() => container.classList.toggle('completed'));
        });
    });

    // Update subtitle
    document.getElementById('subtitle').innerHTML =
        containers.length + ' tasks so far...';
});

// Event handling for "add task" form
document.addEventListener('DOMContentLoaded', async _ => {
    const button = document.getElementById('button');
    const textfield = document.getElementById('textfield');
    
    const handleSubmission = _ => {
        fetch('/add/' + textfield.value, { method: 'post' })
            .then(_ => window.location.replace('/'));
    };
    
    button.addEventListener('click', handleSubmission);
    textfield.addEventListener('keydown', e => {
        if (e.key === 'Enter')
            handleSubmission();
    });
});
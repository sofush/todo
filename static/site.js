const addTaskElement = (task) => {
    const container = document.getElementById('container');
    const form = document.getElementById('form');
    const taskContainer = document.createElement('div');
    const index = document.createElement('label');
    const description = document.createElement('label');
    
    taskContainer.appendChild(index);
    taskContainer.appendChild(description);
    container.insertBefore(taskContainer, form);

    index.innerHTML = task.id + ")";
    description.innerHTML = task.description;
    if (task.completed === true)
        taskContainer.classList.add('completed');

    taskContainer.classList.add('task-container');
    index.classList.add('task-index');
    description.classList.add('task');
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
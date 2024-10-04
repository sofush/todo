document.addEventListener('DOMContentLoaded', e => {
    const containers = document.getElementsByClassName('task-container');
    
    Array.from(containers).forEach(container => {
        const inner = container.getElementsByClassName('task');
        
        if (inner.length < 1) return;

        inner[0].addEventListener('click', _ => {
            container.classList.toggle('completed');
        });
    });
});
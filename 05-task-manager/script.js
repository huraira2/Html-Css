// DOM Elements
const addTaskBtn = document.getElementById('addTaskBtn');
const addTaskModal = document.getElementById('addTaskModal');
const modalClose = document.querySelector('.modal-close');
const cancelBtn = document.getElementById('cancelBtn');
const taskForm = document.getElementById('taskForm');
const filterBtns = document.querySelectorAll('.filter-btn');
const navItems = document.querySelectorAll('.nav-item');

// Task data
let tasks = [
    {
        id: 1,
        title: "Design new landing page",
        description: "Create wireframes and mockups for the new product landing page",
        priority: "high",
        status: "pending",
        project: "website",
        dueDate: "2025-03-15",
        assignees: ["user1", "user2"],
        progress: 0
    },
    {
        id: 2,
        title: "Update user documentation",
        description: "Review and update the user guide with new features",
        priority: "medium",
        status: "pending",
        project: "mobile",
        dueDate: "2025-03-18",
        assignees: ["user2"],
        progress: 0
    },
    {
        id: 3,
        title: "Implement user authentication",
        description: "Set up secure login and registration system",
        priority: "high",
        status: "in-progress",
        project: "mobile",
        dueDate: "2025-03-20",
        assignees: ["user1"],
        progress: 65
    },
    {
        id: 4,
        title: "Create social media content",
        description: "Design posts for upcoming product launch",
        priority: "low",
        status: "in-progress",
        project: "marketing",
        dueDate: "2025-03-25",
        assignees: ["user2", "user1"],
        progress: 30
    },
    {
        id: 5,
        title: "Set up project repository",
        description: "Initialize Git repository and set up CI/CD pipeline",
        priority: "medium",
        status: "completed",
        project: "website",
        completedDate: "2025-03-10",
        assignees: ["user1"],
        progress: 100
    },
    {
        id: 6,
        title: "Research competitor analysis",
        description: "Analyze competitor features and pricing strategies",
        priority: "low",
        status: "completed",
        project: "marketing",
        completedDate: "2025-03-08",
        assignees: ["user2"],
        progress: 100
    }
];

// Project data
const projects = {
    website: { name: "Website Redesign", color: "#ff6b6b" },
    mobile: { name: "Mobile App", color: "#4ecdc4" },
    marketing: { name: "Marketing Campaign", color: "#45b7d1" }
};

// User data
const users = {
    user1: { name: "John Doe", avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50" },
    user2: { name: "Jane Smith", avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=50" }
};

// Modal functionality
addTaskBtn.addEventListener('click', () => {
    addTaskModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

function closeModal() {
    addTaskModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    taskForm.reset();
}

modalClose.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

addTaskModal.addEventListener('click', (e) => {
    if (e.target === addTaskModal) {
        closeModal();
    }
});

// Form submission
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(taskForm);
    const newTask = {
        id: Date.now(),
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        priority: document.getElementById('taskPriority').value,
        status: 'pending',
        project: document.getElementById('taskProject').value,
        dueDate: document.getElementById('taskDue').value,
        assignees: ['user1'], // Default assignee
        progress: 0
    };
    
    tasks.push(newTask);
    renderTasks();
    updateTaskCounts();
    closeModal();
    showNotification('Task added successfully!', 'success');
});

// Filter functionality
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        filterTasks(filter);
    });
});

function filterTasks(filter) {
    const taskCards = document.querySelectorAll('.task-card');
    
    taskCards.forEach(card => {
        const status = card.closest('.task-column').dataset.status;
        
        if (filter === 'all' || status === filter) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// Navigation functionality
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Update board title
        const navText = item.querySelector('.nav-text').textContent;
        document.querySelector('.board-title').textContent = navText;
    });
});

// Render tasks
function renderTasks() {
    const pendingContainer = document.getElementById('pendingTasks');
    const inProgressContainer = document.getElementById('inProgressTasks');
    const completedContainer = document.getElementById('completedTasks');
    
    // Clear containers
    pendingContainer.innerHTML = '';
    inProgressContainer.innerHTML = '';
    completedContainer.innerHTML = '';
    
    tasks.forEach(task => {
        const taskCard = createTaskCard(task);
        
        switch (task.status) {
            case 'pending':
                pendingContainer.appendChild(taskCard);
                break;
            case 'in-progress':
                inProgressContainer.appendChild(taskCard);
                break;
            case 'completed':
                completedContainer.appendChild(taskCard);
                break;
        }
    });
}

function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = `task-card ${task.status === 'completed' ? 'completed' : ''}`;
    card.dataset.priority = task.priority;
    card.dataset.taskId = task.id;
    
    const project = projects[task.project];
    const assigneeAvatars = task.assignees.map(userId => {
        const user = users[userId];
        return `<img src="${user.avatar}" alt="${user.name}" class="assignee-avatar">`;
    }).join('');
    
    const progressHTML = task.status === 'in-progress' ? `
        <div class="task-progress">
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${task.progress}%;"></div>
            </div>
            <span class="progress-text">${task.progress}%</span>
        </div>
    ` : '';
    
    const dateHTML = task.status === 'completed' 
        ? `<div class="task-completed">Completed: ${formatDate(task.completedDate)}</div>`
        : `<div class="task-due">Due: ${formatDate(task.dueDate)}</div>`;
    
    card.innerHTML = `
        <div class="task-header">
            <div class="task-priority ${task.priority}"></div>
            <button class="task-menu" onclick="showTaskMenu(${task.id})">⋯</button>
        </div>
        <h4 class="task-title">${task.title}</h4>
        <p class="task-description">${task.description}</p>
        ${progressHTML}
        <div class="task-meta">
            <div class="task-project">
                <div class="project-color" style="background: ${project.color};"></div>
                <span>${project.name}</span>
            </div>
            ${dateHTML}
        </div>
        <div class="task-assignees">
            ${assigneeAvatars}
        </div>
    `;
    
    // Add click event for task details
    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('task-menu')) {
            showTaskDetails(task);
        }
    });
    
    return card;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
    });
}

function updateTaskCounts() {
    const pendingCount = tasks.filter(t => t.status === 'pending').length;
    const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
    const completedCount = tasks.filter(t => t.status === 'completed').length;
    
    // Update column counts
    document.querySelector('[data-status="pending"] .task-count').textContent = pendingCount;
    document.querySelector('[data-status="in-progress"] .task-count').textContent = inProgressCount;
    document.querySelector('[data-status="completed"] .task-count').textContent = completedCount;
    
    // Update sidebar counts
    const allTasksCount = tasks.length;
    const importantCount = tasks.filter(t => t.priority === 'high').length;
    const todayCount = tasks.filter(t => isToday(t.dueDate)).length;
    const weekCount = tasks.filter(t => isThisWeek(t.dueDate)).length;
    
    const navCounts = document.querySelectorAll('.nav-item .task-count');
    navCounts[0].textContent = allTasksCount;
    navCounts[1].textContent = importantCount;
    navCounts[2].textContent = todayCount;
    navCounts[3].textContent = weekCount;
}

function isToday(dateString) {
    const today = new Date();
    const date = new Date(dateString);
    return date.toDateString() === today.toDateString();
}

function isThisWeek(dateString) {
    const today = new Date();
    const date = new Date(dateString);
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    return date >= weekStart && date <= weekEnd;
}

function showTaskMenu(taskId) {
    // Simple context menu simulation
    const actions = ['Edit', 'Move to In Progress', 'Move to Completed', 'Delete'];
    const action = prompt('Choose action:\n' + actions.map((a, i) => `${i + 1}. ${a}`).join('\n'));
    
    if (action) {
        const actionIndex = parseInt(action) - 1;
        const task = tasks.find(t => t.id === taskId);
        
        switch (actionIndex) {
            case 0: // Edit
                editTask(task);
                break;
            case 1: // Move to In Progress
                task.status = 'in-progress';
                task.progress = 25;
                break;
            case 2: // Move to Completed
                task.status = 'completed';
                task.progress = 100;
                task.completedDate = new Date().toISOString().split('T')[0];
                break;
            case 3: // Delete
                if (confirm('Are you sure you want to delete this task?')) {
                    tasks = tasks.filter(t => t.id !== taskId);
                }
                break;
        }
        
        renderTasks();
        updateTaskCounts();
    }
}

function editTask(task) {
    // Populate form with task data
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description;
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskProject').value = task.project;
    document.getElementById('taskDue').value = task.dueDate;
    
    // Show modal
    addTaskModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Update form submission to edit instead of create
    taskForm.onsubmit = (e) => {
        e.preventDefault();
        
        task.title = document.getElementById('taskTitle').value;
        task.description = document.getElementById('taskDescription').value;
        task.priority = document.getElementById('taskPriority').value;
        task.project = document.getElementById('taskProject').value;
        task.dueDate = document.getElementById('taskDue').value;
        
        renderTasks();
        updateTaskCounts();
        closeModal();
        showNotification('Task updated successfully!', 'success');
        
        // Reset form submission
        taskForm.onsubmit = null;
    };
}

function showTaskDetails(task) {
    const project = projects[task.project];
    const assigneeNames = task.assignees.map(userId => users[userId].name).join(', ');
    
    alert(`Task Details:
    
Title: ${task.title}
Description: ${task.description}
Priority: ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
Status: ${task.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
Project: ${project.name}
Assignees: ${assigneeNames}
Due Date: ${task.dueDate}
${task.progress ? `Progress: ${task.progress}%` : ''}
${task.completedDate ? `Completed: ${task.completedDate}` : ''}`);
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        ${type === 'success' ? 'background: #10b981;' : 'background: #ef4444;'}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Drag and drop functionality (basic simulation)
function enableDragAndDrop() {
    const taskCards = document.querySelectorAll('.task-card');
    const taskLists = document.querySelectorAll('.task-list');
    
    taskCards.forEach(card => {
        card.draggable = true;
        
        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', card.dataset.taskId);
            card.style.opacity = '0.5';
        });
        
        card.addEventListener('dragend', () => {
            card.style.opacity = '1';
        });
    });
    
    taskLists.forEach(list => {
        list.addEventListener('dragover', (e) => {
            e.preventDefault();
            list.style.background = '#e2e8f0';
        });
        
        list.addEventListener('dragleave', () => {
            list.style.background = '';
        });
        
        list.addEventListener('drop', (e) => {
            e.preventDefault();
            list.style.background = '';
            
            const taskId = parseInt(e.dataTransfer.getData('text/plain'));
            const newStatus = list.closest('.task-column').dataset.status;
            
            const task = tasks.find(t => t.id === taskId);
            if (task && task.status !== newStatus) {
                task.status = newStatus;
                
                if (newStatus === 'completed') {
                    task.progress = 100;
                    task.completedDate = new Date().toISOString().split('T')[0];
                } else if (newStatus === 'in-progress' && task.progress === 0) {
                    task.progress = 25;
                }
                
                renderTasks();
                updateTaskCounts();
                enableDragAndDrop(); // Re-enable after re-render
                showNotification(`Task moved to ${newStatus.replace('-', ' ')}!`, 'success');
            }
        });
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    updateTaskCounts();
    enableDragAndDrop();
});
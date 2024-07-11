// script4.js

// Паттерн "Одиночка" для управления состоянием
class StateManager {
    constructor() {
        if (StateManager.instance) {
            return StateManager.instance;
        }
        this.state = {
            currentDate: new Date(),
            notes: {
                family: [],
                health: [],
                hobby: [],
                travel: [],
                business: []
            }
        };
        StateManager.instance = this;
    }

    getState() {
        return this.state;
    }

    updateState(newState) {
        this.state = { ...this.state, ...newState };
    }
}

// Паттерн "Наблюдатель" для управления отображением даты
class DateObserver {
    constructor(element) {
        this.element = element;
        this.update();
    }

    update() {
        const state = new StateManager().getState();
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        this.element.textContent = state.currentDate.toLocaleDateString('ru-RU', options);
    }
}

// Паттерн "Команда" для управления заметками
class Command {
    execute() {}
}

class AddNoteCommand extends Command {
    constructor(folder, note) {
        super();
        this.folder = folder;
        this.note = note;
    }

    execute() {
        const stateManager = new StateManager();
        const state = stateManager.getState();
        state.notes[this.folder].push(this.note);
        stateManager.updateState({ notes: state.notes });
    }
}

class NoteManager {
    constructor() {
        this.commands = [];
    }

    executeCommand(command) {
        command.execute();
        this.commands.push(command);
    }

    getNotes(folder) {
        return new StateManager().getState().notes[folder];
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const homeLink = document.getElementById('home-link');
    const homeMenuLink = document.getElementById('home-menu-link');
    const servicesLink = document.getElementById('services-link');
    const notesLink = document.getElementById('notes-link');
    const calendarContainer = document.getElementById('calendar-container');
    const notesMenu = document.getElementById('notes-menu');
    const homeContainer = document.getElementById('home-container');
    const currentDateSpan = document.getElementById('current-date');
    const addNoteBtn = document.getElementById('add-note-btn');
    const saveNoteBtn = document.getElementById('save-note-btn');
    const noteEditor = document.getElementById('note-editor');
    const noteDateInput = document.getElementById('note-date');
    const noteContentInput = document.getElementById('note-content');
    const notesList = document.getElementById('notes-list');
    const addNoteBtnMain = document.getElementById('add-note-btn-main');
    const taskList = document.getElementById('task-list');
    const profileAvatar = document.getElementById('profile-avatar');
    const profileDropdown = document.getElementById('profile-dropdown');
    const avatarUpload = document.getElementById('avatar-upload');
    const logoutBtn = document.getElementById('logout-btn');
    const addProjectBtn = document.getElementById('add-project-btn');
    const newProjectNameInput = document.getElementById('new-project-name');
    const projectList = document.getElementById('project-list');
    const foldersList = document.getElementById('folders-list');
    let calendar;
    const noteManager = new NoteManager();
    const stateManager = new StateManager();

    // Display current date in services menu
    new DateObserver(currentDateSpan);

    // Switch between main content and calendar/notes
    homeLink.addEventListener('click', showHome);
    homeMenuLink.addEventListener('click', showHome);
    servicesLink.addEventListener('click', toggleCalendar);
    notesLink.addEventListener('click', showNotes);

    function showHome() {
        homeContainer.classList.remove('hidden');
        calendarContainer.classList.add('hidden');
        notesMenu.classList.add('hidden');
        displayMainNotes();
    }

    function toggleCalendar() {
        calendarContainer.classList.toggle('hidden');
        homeContainer.classList.add('hidden');
        notesMenu.classList.add('hidden');
        if (!calendarContainer.classList.contains('hidden')) {
            initCalendar();
        }
    }

    function showNotes() {
        notesMenu.classList.remove('hidden');
        calendarContainer.classList.add('hidden');
        homeContainer.classList.add('hidden');
    }

    // Handle folder selection and display notes
    document.querySelectorAll('.folder-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const folder = this.getAttribute('data-folder').toLowerCase();
            document.getElementById('folder-title').textContent = folder.charAt(0).toUpperCase() + folder.slice(1);
            displayNotes(folder);
            noteEditor.classList.add('hidden');
        });
    });

    function displayNotes(folder) {
        notesList.innerHTML = '';
        const notes = noteManager.getNotes(folder);
        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note';
            noteElement.innerHTML = `<p>${note.content}</p><div class="note-time">${note.time}</div>`;
            notesList.appendChild(noteElement);
        });
    }

    addNoteBtn.addEventListener('click', () => {
        noteEditor.classList.remove('hidden');
        noteDateInput.value = new Date().toISOString().substr(0, 10);
        noteContentInput.value = '';
    });

    saveNoteBtn.addEventListener('click', () => {
        const date = noteDateInput.value;
        const content = noteContentInput.value;
        const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        const folder = document.getElementById('folder-title').textContent.toLowerCase();
        noteManager.executeCommand(new AddNoteCommand(folder, { date, content, time }));
        noteEditor.classList.add('hidden');
        displayNotes(folder);

        // Update main notes
        displayMainNotes();
    });

    addNoteBtnMain.addEventListener('click', () => {
        noteEditor.classList.remove('hidden');
        noteDateInput.value = new Date().toISOString().substr(0, 10);
        noteContentInput.value = '';
    });

    function displayMainNotes() {
        taskList.innerHTML = '';
        const allNotes = Object.values(stateManager.getState().notes).flat();
        allNotes.sort((a, b) => new Date(b.date) - new Date(a.date));
        allNotes.slice(0, 5).forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note';
            noteElement.innerHTML = `<p>${note.content}</p><div class="note-time">${note.time}</div>`;
            taskList.appendChild(noteElement);
        });
    }

    function initCalendar() {
        if (calendar) {
            return;
        }
        calendar = new FullCalendar.Calendar(calendarContainer, {
            initialView: 'dayGridMonth',
            locale: 'ru',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            events: getCalendarEvents() // Load events from notes
        });
        calendar.render();
    }

    function getCalendarEvents() {
        const events = [];
        const state = stateManager.getState();
        Object.values(state.notes).forEach(folder => {
            folder.forEach(note => {
                events.push({
                    title: note.content,
                    start: note.date
                });
            });
        });
        return events;
    }

    avatarUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            profileAvatar.src = e.target.result;
            localStorage.setItem('profileAvatar', e.target.result);
        };
        reader.readAsDataURL(file);
    });

    profileAvatar.addEventListener('click', function() {
        profileDropdown.classList.toggle('hidden');
    });

    logoutBtn.addEventListener('click', function() {
        sessionStorage.removeItem('loggedIn');
        window.location.href = 'login.html';
    });

    addProjectBtn.addEventListener('click', () => {
        const projectName = newProjectNameInput.value.trim();
        if (projectName) {
            addNewProject(projectName);
            newProjectNameInput.value = '';
        }
    });

    function addNewProject(name) {
        const formattedName = name.toLowerCase();
        const state = stateManager.getState();
        state.notes[formattedName] = [];
        stateManager.updateState({ notes: state.notes });
        const projectElement = document.createElement('li');
        projectElement.innerHTML = `<a href="#" data-folder="${formattedName}">${name}</a>`;
        projectList.appendChild(projectElement);
        const folderButton = document.createElement('button');
        folderButton.className = 'folder-btn';
        folderButton.setAttribute('data-folder', formattedName);
        folderButton.textContent = name;
        folderButton.addEventListener('click', function() {
            document.getElementById('folder-title').textContent = name;
            displayNotes(formattedName);
            noteEditor.classList.add('hidden');
        });
        foldersList.appendChild(folderButton);
    }
});

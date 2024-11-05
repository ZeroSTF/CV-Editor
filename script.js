let editMode = false;
let originalContent = '';

document.addEventListener('DOMContentLoaded', () => {
    originalContent = document.getElementById('cv-container').innerHTML;
    loadProgress();
});

function toggleEditMode() {
    editMode = !editMode;
    const editableElements = document.querySelectorAll('[contenteditable]');
    const formattingControls = document.querySelector('.formatting-controls');
    
    editableElements.forEach(element => {
        element.contentEditable = editMode;
    });
    
    formattingControls.style.display = editMode ? 'block' : 'none';
    showMessage(editMode ? 'Edit mode enabled' : 'Edit mode disabled');
}

function formatText(command, value = null) {
    if (!editMode) return;
    
    if (command === 'heading') {
        if (value) {
            document.execCommand('formatBlock', false, value);
        }
    } else if (command === 'list') {
        if (value === 'bullet') {
            document.execCommand('insertUnorderedList', false, null);
        } else if (value === 'number') {
            document.execCommand('insertOrderedList', false, null);
        }
    } else {
        document.execCommand(command, false, null);
    }
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (!editMode) return;
    
    if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
            case 'b':
                e.preventDefault();
                formatText('bold');
                break;
            case 'i':
                e.preventDefault();
                formatText('italic');
                break;
            case 'u':
                e.preventDefault();
                formatText('underline');
                break;
        }
    }
});

function generatePDF() {
    const element = document.getElementById('cv-container');
    const options = {
        margin: 10,
        filename: 'CV-Riadh-Chnitir.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    const controls = document.querySelector('.controls');
    const formattingControls = document.querySelector('.formatting-controls');
    controls.style.display = 'none';
    formattingControls.style.display = 'none';

    html2pdf().set(options).from(element).save().then(() => {
        controls.style.display = 'block';
        if (editMode) formattingControls.style.display = 'block';
    });
}

function saveProgress() {
    const content = document.getElementById('cv-container').innerHTML;
    localStorage.setItem('cvContent', content);
    showMessage('Progress saved successfully!');
}

function loadProgress() {
    const savedContent = localStorage.getItem('cvContent');
    if (savedContent) {
        document.getElementById('cv-container').innerHTML = savedContent;
        showMessage('Saved content loaded!');
    }
}

function resetProgress() {
    if (confirm('Are you sure you want to reset to the original version? All changes will be lost.')) {
        document.getElementById('cv-container').innerHTML = originalContent;
        localStorage.removeItem('cvContent');
        showMessage('Reset to original version');
    }
}

function showMessage(text) {
    const existingMessage = document.querySelector('.save-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const message = document.createElement('div');
    message.className = 'save-message';
    message.textContent = text;
    document.body.appendChild(message);
    message.style.display = 'block';

    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Autosave
setInterval(() => {
    if (editMode) {
        saveProgress();
    }
}, 30000);
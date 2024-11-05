let editMode = false;
let originalContent = '';

// Save the original content when the page loads
document.addEventListener('DOMContentLoaded', () => {
    originalContent = document.getElementById('cv-container').innerHTML;
    loadProgress(); // Load any saved progress
});

function toggleEditMode() {
    editMode = !editMode;
    const editableElements = document.querySelectorAll('[contenteditable]');
    editableElements.forEach(element => {
        element.contentEditable = editMode;
    });
    
    // Show visual feedback
    showMessage(editMode ? 'Edit mode enabled' : 'Edit mode disabled');
}

function generatePDF() {
    const element = document.getElementById('cv-container');
    const options = {
        margin: 10,
        filename: 'CV-Riadh-Chnitir.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Temporarily hide controls for PDF generation
    const controls = document.querySelector('.controls');
    controls.style.display = 'none';

    html2pdf().set(options).from(element).save().then(() => {
        controls.style.display = 'block';
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
    // Remove any existing message
    const existingMessage = document.querySelector('.save-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create and show new message
    const message = document.createElement('div');
    message.className = 'save-message';
    message.textContent = text;
    document.body.appendChild(message);
    message.style.display = 'block';

    // Remove message after animation
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Add autosave functionality (every 30 seconds)
setInterval(() => {
    if (editMode) {
        saveProgress();
    }
}, 30000);
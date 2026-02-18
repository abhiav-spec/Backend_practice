const form = document.getElementById('note-form');
const notesList = document.getElementById('notes-list');

async function fetchNotes() {
  const res = await fetch('/notes');
  const data = await res.json();
  renderNotes(data.notes || []);
}

function renderNotes(notes) {
  notesList.innerHTML = '';
  if (!notes || notes.length === 0 || !notes.some(n => n != null)) {
    notesList.innerHTML = '<p class="small">No notes yet.</p>';
    return;
  }

  notes.forEach((note, idx) => {
    if (note == null) return; // deleted or null slot

    const el = document.createElement('div');
    el.className = 'note';

    el.innerHTML = `
      <div class="meta">
        <h3>${escapeHtml(note.title || 'Untitled')}</h3>
        <p>${escapeHtml(note.description || '')}</p>
        <div class="small">ID: ${idx}</div>
      </div>
      <div class="actions">
        <button data-id="${idx}" class="edit">Edit</button>
        <button data-id="${idx}" class="delete">Delete</button>
      </div>
    `;

    notesList.appendChild(el);
  });

  // attach handlers
  document.querySelectorAll('.delete').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      await fetch(`/notes/${id}`, { method: 'DELETE' });
      fetchNotes();
    });
  });

  document.querySelectorAll('.edit').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      const newDesc = prompt('Enter new description:');
      if (newDesc === null) return;
      await fetch(`/notes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: newDesc })
      });
      fetchNotes();
    });
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  if (!title && !description) return;

  await fetch('/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description })
  });

  form.reset();
  fetchNotes();
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// initial load
fetchNotes();

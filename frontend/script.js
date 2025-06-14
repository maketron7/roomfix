const form = document.getElementById('complaintForm');
const list = document.getElementById('complaintList');
const message = document.getElementById('message');

form.addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(form);

  try {
    const res = await fetch('https://roomfix-1.onrender.com/api/complaints', {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to submit complaint');
    message.style.color = 'green';
    message.textContent = 'Complaint submitted successfully!';
    form.reset();
    loadComplaints();
  } catch (err) {
    console.error(err);
    message.style.color = 'red';
    message.textContent = 'Error submitting complaint.';
  }

  setTimeout(() => { message.textContent = ''; }, 3000);
});

async function loadComplaints() {
  try {
    const res = await fetch('https://roomfix-1.onrender.com/api/complaints');
    const complaints = await res.json();
    list.innerHTML = '';
    complaints.forEach(c => {
      const li = document.createElement('li');
      li.innerHTML = `<b>${c.room}</b>: ${c.description}<br><img src="${c.imageUrl}"><br>Status: ${c.status}`;
      if (c.status !== 'Resolved') {
        const btn = document.createElement('button');
        btn.textContent = 'Mark Resolved';
        btn.onclick = async () => {
          await fetch(`https://roomfix-1.onrender.com/api/complaints/${c._id}`, { method: 'PUT' });
          loadComplaints();
        };
        li.appendChild(btn);
      }
      list.appendChild(li);
    });
  } catch (err) {
    console.error('Loading error:', err);
  }
}

loadComplaints();
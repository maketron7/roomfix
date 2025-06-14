const form = document.getElementById('complaintForm');
const list = document.getElementById('complaintList');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  await fetch('https://roomfix-1.onrender.com/api/complaints', {
    method: 'POST',
    body: formData
  });
  form.reset();
  loadComplaints();
});

async function loadComplaints() {
  const res = await fetch('https://roomfix-1.onrender.com/api/complaints');
  const complaints = await res.json();
  list.innerHTML = '';
  complaints.forEach(({ _id, room, description, imageUrl, status }) => {
    const li = document.createElement('li');
    li.innerHTML = `<b>${room}</b>: ${description}<br><img src=\"${imageUrl}\" width=\"100\"><br>Status: ${status}`;
    if (status !== 'Resolved') {
      const btn = document.createElement('button');
      btn.textContent = 'Mark Resolved';
      btn.onclick = async () => {
        await fetch(`https://roomfix-1.onrender.com/api/complaints/${_id}`, { method: 'PUT' });
        loadComplaints();
      };
      li.appendChild(btn);
    }
    list.appendChild(li);
  });
}

loadComplaints();

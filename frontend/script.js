const form = document.getElementById('complaintForm');
const list = document.getElementById('complaintList');
const message = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  message.textContent = 'Submitting...';

  try {
    const res = await fetch('https://roomfix-1.onrender.com/api/complaints', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) throw new Error('Submission failed');
    message.textContent = '✅ Complaint submitted!';
    form.reset();
    loadComplaints();
  } catch (err) {
    message.textContent = '❌ Failed to submit complaint.';
  }
});

async function loadComplaints() {
  const res = await fetch('https://roomfix-1.onrender.com/api/complaints');
  const complaints = await res.json();

  list.innerHTML = '';
  complaints.forEach(({ _id, room, description, imageUrl, status }) => {
    const li = document.createElement('li');
    li.innerHTML = `<b>${room}</b>: ${description}<br><img src="${imageUrl}" /><br>Status: ${status}`;
    if (status !== 'Resolved') {
      const btn = document.createElement('button');
      btn.textContent = 'Mark Resolved';
      btn.onclick = async () => {
        await fetch(`https://roomfix-1.onrender.com/api/complaints/\${_id}`, {
          method: 'PUT'
        });
        loadComplaints();
      };
      li.appendChild(btn);
    }
    list.appendChild(li);
  });
}

loadComplaints();

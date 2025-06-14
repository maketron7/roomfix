const form = document.getElementById('complaintForm');
const list = document.getElementById('complaintList');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = document.getElementById('message');

  try {
    const res = await fetch('https://roomfix-1.onrender.com/api/complaints', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) throw new Error("Failed to submit complaint");

    message.style.color = 'green';
    message.textContent = 'Complaint submitted successfully!';
    form.reset();
    loadComplaints();
  } catch (error) {
    message.style.color = 'red';
    message.textContent = 'Error submitting complaint. Please try again.';
  }

  // Hide message after 3 seconds
  setTimeout(() => {
    message.textContent = '';
  }, 3000);
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

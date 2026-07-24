// Default Mock Data
const initialEmployees = [
  { id: "1024", name: "Sarah Chen", dept: "Engineering", role: "Frontend Developer", status: "Active" },
  { id: "1025", name: "Marcus Vance", dept: "Marketing", role: "SEO Specialist", status: "Active" },
  { id: "1026", name: "Elena Rostova", dept: "Human Resources", role: "HR Specialist", status: "Onboarding" }
];

// Initialize Data Store with LocalStorage fallback
let employees = JSON.parse(localStorage.getItem('ems_employees')) || initialEmployees;

// DOM Elements
const tableBody = document.getElementById('employee-table-body');
const searchInput = document.getElementById('search-input');
const modal = document.getElementById('employee-modal');
const modalTitle = document.getElementById('modal-title');
const empForm = document.getElementById('employee-form');
const addBtn = document.getElementById('add-employee-btn');

// Form Field Controls
const empIdInput = document.getElementById('emp-id');
const empNameInput = document.getElementById('emp-name');
const empDeptInput = document.getElementById('emp-dept');
const empRoleInput = document.getElementById('emp-role');
const empStatusInput = document.getElementById('emp-status');

// Stat Display Counters
const statTotal = document.getElementById('stat-total');
const statActive = document.getElementById('stat-active');
const statOther = document.getElementById('stat-other');

// Save records to LocalStorage
function saveToStorage() {
  localStorage.setItem('ems_employees', JSON.stringify(employees));
  updateStats();
}

// Update Top Dashboard Summary Counters
function updateStats() {
  statTotal.textContent = employees.length;
  statActive.textContent = employees.filter(e => e.status.toLowerCase() === 'active').length;
  statOther.textContent = employees.filter(e => e.status.toLowerCase() !== 'active').length;
}

// Get appropriate CSS Badge Class based on Status
function getBadgeClass(status) {
  switch (status.toLowerCase()) {
    case 'active': return 'active';
    case 'onboarding': return 'onboarding';
    default: return 'on-leave';
  }
}

// READ: Render Table Records (With Live Search Filtering)
function renderTable(filterText = '') {
  tableBody.innerHTML = '';

  const filtered = employees.filter(emp => 
    emp.name.toLowerCase().includes(filterText.toLowerCase()) ||
    emp.dept.toLowerCase().includes(filterText.toLowerCase()) ||
    emp.role.toLowerCase().includes(filterText.toLowerCase())
  );

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--text-muted);">No records found.</td></tr>`;
    return;
  }

  filtered.forEach(emp => {
    const row = document.createElement('tr');
    const badgeClass = getBadgeClass(emp.status);

    row.innerHTML = `
      <td class="employee-cell">
        <img src="assets/images/avatars/default-avatar.png" alt="" class="avatar-sm" onerror="this.src='https://via.placeholder.com/28'">
        <span>${emp.name}</span>
      </td>
      <td>#EMP-${emp.id}</td>
      <td>${emp.dept}</td>
      <td>${emp.role}</td>
      <td><span class="status-badge ${badgeClass}">${emp.status}</span></td>
      <td>
        <div class="actions-cell">
          <button class="btn btn-sm btn-edit" onclick="openEditModal('${emp.id}')">Edit</button>
          <button class="btn btn-sm btn-delete" onclick="deleteEmployee('${emp.id}')">Delete</button>
        </div>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// CREATE / UPDATE: Submit Handler
empForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const id = empIdInput.value;
  const name = empNameInput.value.trim();
  const dept = empDeptInput.value;
  const role = empRoleInput.value.trim();
  const status = empStatusInput.value;

  if (id) {
    // UPDATE Existing Record
    const index = employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      employees[index] = { id, name, dept, role, status };
    }
  } else {
    // CREATE New Record
    const newId = Math.floor(1000 + Math.random() * 9000).toString();
    employees.push({ id: newId, name, dept, role, status });
  }

  saveToStorage();
  renderTable(searchInput.value);
  closeModal();
});

// EDIT: Populate Modal Form
window.openEditModal = function(id) {
  const emp = employees.find(e => e.id === id);
  if (!emp) return;

  modalTitle.textContent = 'Edit Employee';
  empIdInput.value = emp.id;
  empNameInput.value = emp.name;
  empDeptInput.value = emp.dept;
  empRoleInput.value = emp.role;
  empStatusInput.value = emp.status;

  modal.classList.add('open');
};

// DELETE: Remove Record
window.deleteEmployee = function(id) {
  if (confirm('Are you sure you want to delete this employee?')) {
    employees = employees.filter(emp => emp.id !== id);
    saveToStorage();
    renderTable(searchInput.value);
  }
};

// Live Search Filter Handler
searchInput.addEventListener('input', (e) => {
  renderTable(e.target.value);
});

// Modal Control Functions
function openAddModal() {
  modalTitle.textContent = 'Add New Employee';
  empForm.reset();
  empIdInput.value = '';
  modal.classList.add('open');
}

function closeModal() {
  modal.classList.remove('open');
}

// Event Listeners for Modal Triggering
addBtn.addEventListener('click', openAddModal);
document.getElementById('close-modal').addEventListener('click', closeModal);
document.getElementById('cancel-btn').addEventListener('click', closeModal);

// Initial App Startup
updateStats();
renderTable();
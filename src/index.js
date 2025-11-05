let employees = [];
let editingEmployeeId = null;

const elements = {
    modal: document.getElementById('employeeModal'),
    form: document.getElementById('employeeForm'),
    employeeList: document.getElementById('employeeList'),
    searchInput: document.getElementById('searchInput'),
    departmentFilter: document.getElementById('departmentFilter'),
    addEmployeeBtn: document.getElementById('addEmployeeBtn'),
    closeModal: document.getElementById('closeModal'),
    cancelBtn: document.getElementById('cancelBtn'),
    modalTitle: document.getElementById('modalTitle'),
    submitBtn: document.getElementById('submitBtn'),
    employeeId: document.getElementById('employeeId'),
    employeeName: document.getElementById('employeeName'),
    department: document.getElementById('department'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    designation: document.getElementById('designation'),
    joiningDate: document.getElementById('joiningDate')
};

function loadEmployees() {
    const stored = localStorage.getItem('employees');
    if (stored) {
        employees = JSON.parse(stored);
    }
}

function saveEmployees() {
    localStorage.setItem('employees', JSON.stringify(employees));
}

function updateSummary() {
    const totalCount = employees.length;
    const hrCount = employees.filter(emp => emp.department === 'HR').length;
    const itCount = employees.filter(emp => emp.department === 'IT').length;
    const financeCount = employees.filter(emp => emp.department === 'Finance').length;
    const adminCount = employees.filter(emp => emp.department === 'Admin').length;

    document.getElementById('totalCount').textContent = totalCount;
    document.getElementById('hrCount').textContent = hrCount;
    document.getElementById('itCount').textContent = itCount;
    document.getElementById('financeCount').textContent = financeCount;
    document.getElementById('adminCount').textContent = adminCount;
}

function getFilteredEmployees() {
    const searchTerm = elements.searchInput.value.toLowerCase();
    const departmentValue = elements.departmentFilter.value;

    return employees.filter(emp => {
        const matchesSearch =
            emp.name.toLowerCase().includes(searchTerm) ||
            emp.department.toLowerCase().includes(searchTerm) ||
            emp.designation.toLowerCase().includes(searchTerm) ||
            emp.email.toLowerCase().includes(searchTerm);

        const matchesDepartment =
            !departmentValue || emp.department === departmentValue;

        return matchesSearch && matchesDepartment;
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function getInitials(name) {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

function getBadgeClass(department) {
    const badges = {
        'HR': 'badge-hr',
        'IT': 'badge-it',
        'Finance': 'badge-finance',
        'Admin': 'badge-admin'
    };
    return badges[department] || 'badge-hr';
}

function renderEmployees() {
    const filteredEmployees = getFilteredEmployees();

    if (filteredEmployees.length === 0) {
        elements.employeeList.innerHTML = `
            <div class="empty-state">
                <h3>No employees found</h3>
                <p>Try adjusting your search or filters, or add a new employee.</p>
            </div>
        `;
        return;
    }

    elements.employeeList.innerHTML = filteredEmployees.map(emp => `
        <div class="employee-card">
            <div class="employee-header">
                <div class="employee-avatar">${getInitials(emp.name)}</div>
                <div class="employee-info">
                    <h3>${emp.name}</h3>
                    <p class="employee-designation">${emp.designation}</p>
                </div>
            </div>
            <div class="employee-details">
                <div class="detail-row">
                    <span class="detail-label">Department:</span>
                    <span class="employee-badge ${getBadgeClass(emp.department)}">${emp.department}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span>${emp.email}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Phone:</span>
                    <span>${emp.phone}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Joined:</span>
                    <span>${formatDate(emp.joiningDate)}</span>
                </div>
            </div>
            <div class="employee-actions">
                <button class="btn-edit" onclick="editEmployee('${emp.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteEmployee('${emp.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function openModal(isEdit = false) {
    editingEmployeeId = null;
    elements.modalTitle.textContent = isEdit ? 'Edit Employee' : 'Add Employee';
    elements.submitBtn.textContent = isEdit ? 'Update Employee' : 'Save Employee';
    elements.modal.classList.add('active');
}

function closeModal() {
    elements.modal.classList.remove('active');
    elements.form.reset();
    editingEmployeeId = null;
}

function addEmployee(employeeData) {
    const newEmployee = {
        id: Date.now().toString(),
        ...employeeData
    };
    employees.push(newEmployee);
    saveEmployees();
    updateSummary();
    renderEmployees();
}

function updateEmployee(id, employeeData) {
    const index = employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
        employees[index] = {
            id,
            ...employeeData
        };
        saveEmployees();
        updateSummary();
        renderEmployees();
    }
}

function editEmployee(id) {
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
        editingEmployeeId = id;
        elements.employeeId.value = employee.id;
        elements.employeeName.value = employee.name;
        elements.department.value = employee.department;
        elements.email.value = employee.email;
        elements.phone.value = employee.phone;
        elements.designation.value = employee.designation;
        elements.joiningDate.value = employee.joiningDate;
        openModal(true);
    }
}

function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        employees = employees.filter(emp => emp.id !== id);
        saveEmployees();
        updateSummary();
        renderEmployees();
    }
}

elements.addEmployeeBtn.addEventListener('click', () => openModal(false));
elements.closeModal.addEventListener('click', closeModal);
elements.cancelBtn.addEventListener('click', closeModal);

elements.modal.addEventListener('click', (e) => {
    if (e.target === elements.modal) {
        closeModal();
    }
});

elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const employeeData = {
        name: elements.employeeName.value,
        department: elements.department.value,
        email: elements.email.value,
        phone: elements.phone.value,
        designation: elements.designation.value,
        joiningDate: elements.joiningDate.value
    };

    if (editingEmployeeId) {
        updateEmployee(editingEmployeeId, employeeData);
    } else {
        addEmployee(employeeData);
    }

    closeModal();
});

elements.searchInput.addEventListener('input', renderEmployees);
elements.departmentFilter.addEventListener('change', renderEmployees);

loadEmployees();
updateSummary();
renderEmployees();

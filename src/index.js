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
        employeeName: document.getElementById('employeeName'),
        department: document.getElementById('department'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        designation: document.getElementById('designation'),
        joiningDate: document.getElementById('joiningDate'),   
        age : document.getElementById('age'),
        dateofbirth: document.getElementById('dateofbirth'),
      };
  // save our employees to local storage to store employee data ..
    //Saves employees array to local storage as a string.
    // to store employee data object to string 
      function saveEmployees() {
        localStorage.setItem('employees', JSON.stringify(employees)); 
      }
   //  load employees to display string to object in JSON.parse method to use 
      function loadEmployees() {
        employees = JSON.parse(localStorage.getItem('employees') || '[]');
        
      }
      // summary count update
      function updateSummary() {
        document.getElementById('hrCount').textContent = employees.filter(e => e.department === 'HR').length;
        document.getElementById('itCount').textContent = employees.filter(e => e.department === 'IT').length;
        document.getElementById('financeCount').textContent = employees.filter(e => e.department === 'Finance').length;
        document.getElementById('adminCount').textContent = employees.filter(e => e.department === 'Admin').length;
  d
      }
         //Search Employees
      function renderEmployees() {
        const searchTerm = elements.searchInput.value.toLowerCase();
        const filterDept = elements.departmentFilter.value;

        const filtered = employees.filter(emp => {
          const matchesSearch =
            emp.name.toLowerCase().includes(searchTerm) ||
            emp.department.toLowerCase().includes(searchTerm); 
      
          const matchesDept = !filterDept || emp.department === filterDept;
          return matchesSearch && matchesDept;
        });
   // no employees found
        if (filtered.length === 0) {
          elements.employeeList.innerHTML = '<p class="text-center text-lg font-bold text-red-400 mt-6">No employees found.</p>';
          return;
        }
    // DISPLAY EMPLOYEES
        elements.employeeList.innerHTML = filtered.map(emp => `
          <div class="bg-white rounded-xl shadow p-4">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-lg font-semibold">${emp.name}</h3>
                <p class="text-md font-bold text-gray-600 mt-1 ">${emp.designation} (${emp.department})</p>
              </div>
              <div class="space-x-2">
                <button onclick="editEmployee('${emp.id}')" class="px-3 py-1 text-sm bg-yellow-400 hover:bg-yellow-500 rounded">Edit</button>
                <button onclick="deleteEmployee('${emp.id}')" class="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded">Delete</button>
              </div>
            </div>
            <p class="mt-2 text-sm text-gray-500">📧 ${emp.email}</p>
            <p class="text-md text-gray-500">📞 ${emp.phone}</p>
            <p class="text-md text-gray-500">📅 ${emp.joiningDate}</p>
            <p class="text-md text-gray-500">🎈 ${emp.age}</p>
            <p class="text-md text-gray-500">🎂 ${emp.dateofbirth}</p>
          </div>
        `).join('');
      }

      function openModal(edit = false) {
        elements.modal.classList.remove('hidden');
        elements.modal.classList.add('flex');
        elements.modalTitle.textContent = edit ? 'Edit Employee' : 'Add Employee';
        elements.submitBtn.textContent = edit ? 'Update' : 'Save';
      }

      function closeModal() {
        elements.modal.classList.add('hidden');
        elements.form.reset();
        editingEmployeeId = null;
      }
        //add employee
      function addEmployee(data) {
        employees.push({ id: Date.now().toString(), ...data });
        saveEmployees();
        renderEmployees();
        updateSummary();
        closeModal();
      }
     // edit employee
      function editEmployee(id) {
        const emp = employees.find(e => e.id === id);
        if (!emp) return;
        editingEmployeeId = id;
        elements.employeeName.value = emp.name;
        elements.department.value = emp.department;
        elements.email.value = emp.email;
        elements.phone.value = emp.phone;
        elements.designation.value = emp.designation;
        elements.joiningDate.value = emp.joiningDate;
        elements.age.value =emp.age;
        elements.dateofbirth.value =emp.dateofbirth;
        
        openModal(true);
      }
      // update employee
      function updateEmployee(data) {
        const index = employees.findIndex(e => e.id === editingEmployeeId);
        if (employees.findIndex !== -1) {
          employees[index] = { id: editingEmployeeId, ...data };
          saveEmployees();
          renderEmployees();
          updateSummary();
          closeModal();
        }
      }
      // delete employee
      function deleteEmployee(id) {
        if (confirm('Delete this employee?')) {
          employees = employees.filter(e => e.id !== id);
          saveEmployees();
          renderEmployees();
          updateSummary();
        }
      }
      // Events
      elements.addEmployeeBtn.addEventListener('click', () => openModal());
      elements.closeModal.addEventListener('click', closeModal);
      elements.cancelBtn.addEventListener('click', closeModal);
      elements.modal.addEventListener('click', e => { if (e.target === elements.modal) closeModal(); });
     
      elements.form.addEventListener('submit', e => {
        e.preventDefault();
        const data = {
          name: elements.employeeName.value,
          department: elements.department.value,
          email: elements.email.value,
          phone: elements.phone.value,
          designation: elements.designation.value,
          joiningDate: elements.joiningDate.value,
          age:elements.age.value,
          dateofbirth:elements.dateofbirth.value
        };

      
        if (editingEmployeeId) updateEmployee(data);
        else addEmployee(data);
         closeModal();
         elements.form.reset();
      });
      elements.searchInput.addEventListener('input', renderEmployees);
      elements.departmentFilter.addEventListener('change', renderEmployees);

      // Initialize
      loadEmployees();
      renderEmployees();
      updateSummary();

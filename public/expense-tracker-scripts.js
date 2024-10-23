// Switch between tabs
function openTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.style.display = tab.id === tabName ? 'block' : 'none';
    });

    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => {
        button.classList.toggle('active', button.textContent.includes(tabName.split('-')[0]));
    });
}

// Initialize category totals for the pie chart
const categoryTotals = {
    Accommodation: 0,
    Food: 0,
    Transportation: 0,
    Activities: 0,
    Shopping: 0
};

// Handle form submission for expenses
function handleFormSubmission(formId, listId, totalId, type) {
    document.getElementById(formId).addEventListener('submit', function (event) {
        event.preventDefault();
        addExpense(type, listId, totalId);
    });
}

// Add expense and update total
function addExpense(type, listId, totalId) {
    const date = document.getElementById(`${type}-entry-date`).value;
    const category = document.getElementById(`${type}-entry-category`).value;
    const amount = parseFloat(document.getElementById(`${type}-entry-amount`).value);
    const description = document.getElementById(`${type}-entry-description`)?.value || '';
    const participants = document.getElementById(`${type}-entry-participants`)?.value || '';

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
    }

    categoryTotals[category] += amount;

    const listItem = document.createElement('li');
    listItem.textContent = `${date} - ${category} - ₹${amount.toFixed(2)} ${description} ${participants}`;
    document.getElementById(listId).appendChild(listItem);

    const totalElement = document.getElementById(totalId);
    const newTotal = parseFloat(totalElement.textContent) + amount;
    totalElement.textContent = newTotal.toFixed(2);
}

// Generate a pie chart report
document.getElementById('generate-report').addEventListener('click', function () {
    const ctx = document.getElementById('expense-chart').getContext('2d');
    const data = Object.values(categoryTotals);
    const labels = Object.keys(categoryTotals).map(
        category => ` ${category} (₹${categoryTotals[category]?.toFixed(2) || 0})`
    );

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#1E88E5', '#FDD835', '#43A047', '#FB8C00', '#8E24AA']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top', labels: { color: 'black' } }
            }
        }
    });

    alert('Report generated successfully!');
});

// Download PDF report
document.getElementById('download-pdf').addEventListener('click', function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const now = new Date();
    const currentDateTime = now.toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'medium' });

    doc.setFontSize(18);
    doc.text('Expense Tracker Report', 10, 10);
    doc.setFontSize(11);
    doc.text(`Generated on: ${currentDateTime}`, 10, 20);
    doc.line(10, 25, 200, 25);

    doc.setFontSize(14);
    doc.text('Summary:', 10, 35);
    doc.setFontSize(12);
    doc.text(`- Shared Total: ₹${document.getElementById('shared-total').textContent}`, 10, 55);

    doc.setFontSize(14);
    doc.text('Personal expense catagory wise :', 10, 70);
    doc.setFontSize(12);

    let currentY = 80;
    for (const [category, total] of Object.entries(categoryTotals)) {
        doc.text(`${category}: ₹${total.toFixed(2)}`, 10, currentY);
        currentY += 10;
    }

    const canvas = document.getElementById('expense-chart');
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 75, currentY + 10, 60, 60);

    const filename = `expense-report-${now.toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);
});

// Initialize personal and shared expense forms
handleFormSubmission('personal-expenses-form', 'personal-expense-list', 'personal-total', 'personal');
handleFormSubmission('shared-expenses-form', 'shared-expense-list', 'shared-total', 'shared');

// Handle friend input and generate table
document.getElementById('shared-friend-count').addEventListener('input', function () {
    const friendCount = parseInt(this.value);
    const container = document.getElementById('friend-expenses-table-container');
    container.innerHTML = '';

    if (isNaN(friendCount) || friendCount <= 0) return;

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Friend\'s Name</th><th>Amount (Rs)</th>';
    table.appendChild(headerRow);

    for (let i = 0; i < friendCount; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="text" placeholder="Friend ${i + 1}'s Name" required></td>
            <td><input type="number" placeholder="Amount (Rs)" required></td>
        `;
        table.appendChild(row);
    }
    container.appendChild(table);
});

// Display friend-wise breakdown and update shared total
document.getElementById('shared-expenses-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const tableRows = document.querySelectorAll('#friend-expenses-table-container table tr');
    const breakdownList = document.getElementById('friend-breakdown');
    breakdownList.innerHTML = '';

    let totalSharedAmount = 0;

    tableRows.forEach((row, index) => {
        if (index === 0) return;
        const friendName = row.cells[0].querySelector('input').value;
        const amount = parseFloat(row.cells[1].querySelector('input').value);

        if (!isNaN(amount)) {
            totalSharedAmount += amount;
            const listItem = document.createElement('li');
            listItem.textContent = `${friendName} owes ₹${amount.toFixed(2)}`;
            breakdownList.appendChild(listItem);
        }
    });

    document.getElementById('shared-total').textContent = totalSharedAmount.toFixed(2);
});

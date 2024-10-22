// Switch between tabs
function openTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = tab.id === tabName ? 'block' : 'none');

    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => button.classList.toggle('active', button.textContent.includes(tabName.split('-')[0])));
}

// Initialize category totals for the pie chart
const categoryTotals = {
    Accommodation: 0,
    Food: 0,
    Transportation: 0,
    Activities: 0,
    Shopping: 0
};

// Add Expense Handling
function handleFormSubmission(formId, listId, totalId, type) {
    document.getElementById(formId).addEventListener('submit', function (event) {
        event.preventDefault();
        addExpense(type, listId, totalId);
    });
}

// Add Expense and Update Total
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

    // Update category total
    categoryTotals[category] += amount;

    // Create and display list item
    const listItem = document.createElement('li');
    listItem.textContent = `${date} - ${category} - ₹${amount.toFixed(2)} ${description} ${participants}`;
    document.getElementById(listId).appendChild(listItem);

    // Update total display
    const totalElement = document.getElementById(totalId);
    const newTotal = parseFloat(totalElement.textContent) + amount;
    totalElement.textContent = newTotal.toFixed(2);
}

// Color mapping for categories with emojis
const categoryColors = {
    Accommodation: '#1E88E5',
    Food: '#FDD835',
    Transportation: '#43A047',
    Activities: '#FB8C00',
    Shopping: '#8E24AA'
};

// Generate Report and Render Pie Chart
document.getElementById('generate-report').addEventListener('click', function () {
    const ctx = document.getElementById('expense-chart').getContext('2d');

    const data = Object.values(categoryTotals);  // Extract category totals
    const labels = Object.keys(categoryTotals).map(
        category => ` ${category} (${categoryTotals[category] ? `₹${categoryTotals[category].toFixed(2)}` : 0})`
    );

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: Object.values(categoryColors)
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: 'black'  // White legend text for readability
                    }
                }
            }
        }
    });

    alert('Report generated successfully!');
});

document.getElementById('download-pdf').addEventListener('click', function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Get current date and time
    const now = new Date();
    const currentDateTime = now.toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'medium' });

    // Add title with date and time
    doc.setFontSize(18);
    doc.text('Expense Tracker Report', 10, 10);
    doc.setFontSize(11);
    doc.text(`Generated on: ${currentDateTime}`, 10, 20);

    // Add a line break for formatting
    doc.line(10, 25, 200, 25); // Horizontal line separator

    // Add personal and shared totals with descriptions
    doc.setFontSize(14);
    doc.text('Summary:', 10, 35);
    doc.setFontSize(12);
    doc.text(`- Personal Total: ₹${document.getElementById('personal-total').textContent}`, 10, 45);
    doc.text(`- Shared Total: ₹${document.getElementById('shared-total').textContent}`, 10, 55);

    // Add category totals with alignment
    doc.setFontSize(14);
    doc.text('Category Details:', 10, 70); // Section title
    doc.setFontSize(12);

    let currentY = 80; // Initial Y position for category details
    const marginX = 20; // X margin for category names and totals alignment

    for (const [category, total] of Object.entries(categoryTotals)) {
        doc.text(`${category}:`, 10, currentY); // Category name on the left
        doc.text(`₹${total.toFixed(2)}`, marginX + 80, currentY, { align: 'right' }); // Amount aligned to the right
        currentY += 10; // Increment Y position for next line
    }

    // Adjust Y position for shared expenses details
    currentY += 10;

    doc.setFontSize(14);
    doc.text('Shared Expenses Details:', 10, currentY); // Section title
    doc.setFontSize(12);
    currentY += 10;

    // Loop through shared expense items and display details with participants
    const sharedExpenses = document.querySelectorAll('.shared-expense-item');
    sharedExpenses.forEach(item => {
        const expenseName = item.querySelector('.expense-name').textContent;
        const expenseAmount = item.querySelector('.expense-amount').textContent;
        const participants = item.querySelector('.participants').textContent; // Assuming participants are stored here

        doc.text(`- ${expenseName}: ₹${expenseAmount}`, 10, currentY);
        currentY += 10;
        doc.text(`  Shared among: ${participants}`, 15, currentY); // Indented line for participants
        currentY += 10;
    });

    // Adjust Y position for the pie chart
    currentY += 10;

    // Convert chart canvas to image and add to PDF
    const canvas = document.getElementById('expense-chart');
    const imgData = canvas.toDataURL('image/png');

    // Add image to PDF (centered below shared expenses)
    doc.addImage(imgData, 'PNG', 75, currentY, 60, 60); // Adjust position and size as needed

    // Footer with a note
    currentY += 70; // Move below the image
    doc.setFontSize(10);
    doc.text('Note: This report is auto-generated and reflects the latest recorded expenses.', 10, currentY);

    // Save the PDF with a timestamped filename
    const filename = `expense-report-${now.toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);
});

// Initialize Form Handling
handleFormSubmission('personal-expenses-form', 'personal-expense-list', 'personal-total', 'personal');
handleFormSubmission('shared-expenses-form', 'shared-expense-list', 'shared-total', 'shared');

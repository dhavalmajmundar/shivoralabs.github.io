// Logos & Ledger Application Code

document.addEventListener("DOMContentLoaded", () => {
  
  // App categories
  const categories = {
    income: ["Client Project", "Product Sales", "Consulting", "Royalties", "Other"],
    expense: ["Software / SaaS", "Advertising", "Hardware", "Subcontractors", "Office Supplies", "Travel / Meals", "Tax / Licensing", "Other"]
  };

  // Default state if nothing is saved in LocalStorage
  let state = {
    transactions: [
      { id: "1", date: "2026-05-15", type: "income", description: "Consulting Retainer - UI/UX Audit", category: "Consulting", amount: 3500.00, client: "Acme Corp" },
      { id: "2", date: "2026-05-18", type: "expense", description: "Office Co-working Space Desk", category: "Travel / Meals", amount: 300.00, client: "Internal" },
      { id: "3", date: "2026-06-10", type: "income", description: "Mobile App Wireframes & Assets", category: "Client Project", amount: 5500.00, client: "Vibe Tech" },
      { id: "4", date: "2026-06-14", type: "expense", description: "Ultrawide Designer Monitor", category: "Hardware", amount: 1200.00, client: "Internal" },
      { id: "5", date: "2026-07-05", type: "income", description: "Backend Integration Phase 1", category: "Client Project", amount: 8000.00, client: "Summit LLC" },
      { id: "6", date: "2026-07-20", type: "expense", description: "Contractor Dev Payout", category: "Subcontractors", amount: 2500.00, client: "Summit Project" },
      { id: "7", date: "2026-08-01", type: "income", description: "Design Retainer - Cadens Mobile", category: "Client Project", amount: 4800.00, client: "Shivora Projects" },
      { id: "8", date: "2026-08-03", type: "expense", description: "AWS Cloud Infrastructure", category: "Software / SaaS", amount: 142.50, client: "Internal" },
      { id: "9", date: "2026-08-05", type: "expense", description: "Contract Developer Fee", category: "Subcontractors", amount: 1800.00, client: "Cadens App" },
      { id: "10", date: "2026-08-10", type: "income", description: "Vite App Consulting", category: "Consulting", amount: 1500.00, client: "Freelance Client" },
      { id: "11", date: "2026-08-12", type: "expense", description: "Premium Fonts & Assets", category: "Office Supplies", amount: 95.00, client: "Shivora Branding" }
    ],
    invoices: [
      { id: "inv-1", number: "INV-2026-001", client: "Acme Corp", amount: 2400.00, due: "2026-08-25", status: "unpaid" },
      { id: "inv-2", number: "INV-2026-002", client: "Cadens Beta", amount: 3200.00, due: "2026-09-05", status: "unpaid" }
    ]
  };

  // Load state from local storage if it exists
  const localData = localStorage.getItem("logos_ledger_state");
  if (localData) {
    try {
      state = JSON.parse(localData);
    } catch (e) {
      console.error("Error parsing local state, using defaults.");
    }
  }

  // DOM Elements
  const typeSelect = document.getElementById("t-type");
  const categorySelect = document.getElementById("t-category");
  const transactionForm = document.getElementById("transaction-form");
  const invoiceForm = document.getElementById("invoice-form");
  const transactionsTable = document.getElementById("transactions-table").querySelector("tbody");
  const invoicesTable = document.getElementById("invoices-table").querySelector("tbody");
  
  // Dashboard stats
  const metricNet = document.getElementById("metric-net");
  const metricIncome = document.getElementById("metric-income");
  const metricExpense = document.getElementById("metric-expense");
  const metricReceivables = document.getElementById("metric-receivables");
  const incomeCount = document.getElementById("income-count");
  const expenseCount = document.getElementById("expense-count");
  const invoiceCountNote = document.getElementById("invoice-count");
  const invoiceBadge = document.getElementById("invoice-badge");

  // Filters
  const filterType = document.getElementById("filter-type");
  const filterCategory = document.getElementById("filter-category");

  // Data Actions
  const btnExportJson = document.getElementById("export-json");
  const btnExportCsv = document.getElementById("export-csv");
  const btnImport = document.getElementById("import-btn");
  const inputFile = document.getElementById("import-file");
  const btnClear = document.getElementById("clear-data");

  // Form set dates to today by default
  document.getElementById("t-date").value = new Date().toISOString().substring(0, 10);
  document.getElementById("inv-due").value = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10); // 14 days out

  // Helpers
  function saveState() {
    localStorage.setItem("logos_ledger_state", JSON.stringify(state));
    updateDashboard();
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
  }

  // Update categories dropdown based on type selection
  function updateCategoryOptions() {
    const selectedType = typeSelect.value;
    categorySelect.innerHTML = "";
    categories[selectedType].forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    });
  }

  // Populate category options in filter bar
  function populateFilterCategories() {
    filterCategory.innerHTML = '<option value="all">All Categories</option>';
    const allCats = [...categories.income, ...categories.expense];
    allCats.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      filterCategory.appendChild(option);
    });
  }

  // Update Dashboard Numbers, Charts, and Tables
  function updateDashboard() {
    let totalIn = 0;
    let totalOut = 0;
    let inCount = 0;
    let outCount = 0;

    state.transactions.forEach(t => {
      if (t.type === "income") {
        totalIn += t.amount;
        inCount++;
      } else {
        totalOut += t.amount;
        outCount++;
      }
    });

    const netVal = totalIn - totalOut;
    metricNet.textContent = formatCurrency(netVal);
    metricNet.className = "metric-card" + (netVal >= 0 ? " card-flow" : " card-expense");
    
    metricIncome.textContent = formatCurrency(totalIn);
    incomeCount.textContent = `${inCount} transactions logged`;
    
    metricExpense.textContent = formatCurrency(totalOut);
    expenseCount.textContent = `${outCount} transactions logged`;

    let totalReceivables = 0;
    let unpaidCount = 0;
    state.invoices.forEach(inv => {
      if (inv.status === "unpaid") {
        totalReceivables += inv.amount;
        unpaidCount++;
      }
    });

    metricReceivables.textContent = formatCurrency(totalReceivables);
    invoiceBadge.textContent = `${unpaidCount} unpaid`;
    invoiceCountNote.textContent = `${unpaidCount} unpaid invoices`;

    renderTransactions();
    renderInvoices();
    renderChart();
  }

  // Render transactions table
  function renderTransactions() {
    transactionsTable.innerHTML = "";
    
    const typeFilter = filterType.value;
    const catFilter = filterCategory.value;

    const filtered = state.transactions.filter(t => {
      const matchesType = (typeFilter === "all" || t.type === typeFilter);
      const matchesCat = (catFilter === "all" || t.category === catFilter);
      return matchesType && matchesCat;
    });

    // Sort by date descending
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filtered.length === 0) {
      transactionsTable.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--muted); padding: 30px;">No transactions logged match filters.</td></tr>`;
      return;
    }

    filtered.forEach(t => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${t.date}</td>
        <td><span class="${t.type === 'income' ? 'tag-income' : 'tag-expense'}">${t.type === 'income' ? 'CASH IN' : 'CASH OUT'}</span></td>
        <td>${t.description}</td>
        <td><span class="tag-category">${t.category}</span></td>
        <td>${t.client || '-'}</td>
        <td class="${t.type === 'income' ? 'tag-income' : 'tag-expense'}">${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}</td>
        <td style="text-align: right;">
          <button class="btn-icon delete-t-btn" data-id="${t.id}" title="Delete Transaction">
            <svg style="width:16px; height:16px; fill:none; stroke:currentColor; stroke-width:2" viewBox="0 0 24 24">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </td>
      `;
      transactionsTable.appendChild(tr);
    });

    // Wire up delete buttons
    transactionsTable.querySelectorAll(".delete-t-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = btn.getAttribute("data-id");
        state.transactions = state.transactions.filter(t => t.id !== id);
        saveState();
      });
    });
  }

  // Render invoices table
  function renderInvoices() {
    invoicesTable.innerHTML = "";

    if (state.invoices.length === 0) {
      invoicesTable.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--muted); padding: 30px;">No active client invoices tracked.</td></tr>`;
      return;
    }

    // Sort by due date ascending
    state.invoices.sort((a, b) => new Date(a.due) - new Date(b.due));

    state.invoices.forEach(inv => {
      const isPaid = inv.status === "paid";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${inv.number}</strong></td>
        <td>${inv.client}</td>
        <td>${formatCurrency(inv.amount)}</td>
        <td>${inv.due}</td>
        <td><span class="status-badge ${isPaid ? 'status-paid' : 'status-unpaid'}">${isPaid ? 'Paid' : 'Unpaid'}</span></td>
        <td style="text-align: right;">
          ${!isPaid ? `<button class="btn-pay mark-paid-btn" data-id="${inv.id}">Mark Paid</button>` : ''}
          <button class="btn-icon delete-inv-btn" data-id="${inv.id}" title="Delete Invoice">
            <svg style="width:16px; height:16px; fill:none; stroke:currentColor; stroke-width:2" viewBox="0 0 24 24">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </td>
      `;
      invoicesTable.appendChild(tr);
    });

    // Wire up mark paid buttons
    invoicesTable.querySelectorAll(".mark-paid-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = btn.getAttribute("data-id");
        const inv = state.invoices.find(i => i.id === id);
        if (inv) {
          inv.status = "paid";
          
          // Auto add a corresponding income transaction
          state.transactions.push({
            id: Date.now().toString(),
            date: new Date().toISOString().substring(0, 10),
            type: "income",
            description: `Payment for Invoice ${inv.number}`,
            category: "Client Project",
            amount: inv.amount,
            client: inv.client
          });
          
          saveState();
        }
      });
    });

    // Wire up delete invoice buttons
    invoicesTable.querySelectorAll(".delete-inv-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = btn.getAttribute("data-id");
        state.invoices = state.invoices.filter(i => i.id !== id);
        saveState();
      });
    });
  }

  // Draw premium custom SVG monthly bar chart
  function renderChart() {
    const chartSvg = document.getElementById("trend-chart");
    if (!chartSvg) return;

    // Calculate grouping for the last 5 calendar months dynamically
    const monthsMap = {};
    const monthsList = [];
    
    // Initialize last 5 months
    const date = new Date();
    for (let i = 4; i >= 0; i--) {
      const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleString("default", { month: "short", year: "2-digit" });
      monthsMap[key] = { key, label, in: 0, out: 0 };
      monthsList.push(key);
    }

    // Group actual transactions
    state.transactions.forEach(t => {
      const tKey = t.date.substring(0, 7); // YYYY-MM
      if (monthsMap[tKey]) {
        if (t.type === "income") {
          monthsMap[tKey].in += t.amount;
        } else {
          monthsMap[tKey].out += t.amount;
        }
      }
    });

    // Find highest value for scaling
    let maxVal = 1000; // default baseline scale
    monthsList.forEach(key => {
      const m = monthsMap[key];
      if (m.in > maxVal) maxVal = m.in;
      if (m.out > maxVal) maxVal = m.out;
    });

    // Double padding margin safety
    maxVal *= 1.15;

    // Rebuild chart elements
    chartSvg.innerHTML = "";

    // Draw grid baselines
    for (let i = 0; i <= 3; i++) {
      const yVal = 20 + i * 60;
      const amountLabel = formatCurrency(maxVal - (maxVal / 3) * i);
      
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", "55");
      line.setAttribute("y1", yVal);
      line.setAttribute("x2", "480");
      line.setAttribute("y2", yVal);
      line.setAttribute("stroke", i === 3 ? "var(--line-strong)" : "var(--line)");
      line.setAttribute("stroke-width", "1");
      chartSvg.appendChild(line);

      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", "45");
      text.setAttribute("y", yVal + 3);
      text.setAttribute("fill", "var(--muted)");
      text.setAttribute("font-size", "8");
      text.setAttribute("font-family", "var(--font-sans)");
      text.setAttribute("text-anchor", "end");
      text.textContent = formatShortCurrency(maxVal - (maxVal / 3) * i);
      chartSvg.appendChild(text);
    }

    // Render monthly bars
    const barWidth = 18;
    const spacing = 84;
    const startX = 85;

    monthsList.forEach((key, index) => {
      const m = monthsMap[key];
      const x = startX + index * spacing;

      // Heights
      const inHeight = (m.in / maxVal) * 180;
      const outHeight = (m.out / maxVal) * 180;

      // Draw Income Bar (Cyan)
      if (inHeight > 0) {
        const barIn = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        barIn.setAttribute("x", x - 11);
        barIn.setAttribute("y", 200 - inHeight);
        barIn.setAttribute("width", barWidth);
        barIn.setAttribute("height", inHeight);
        barIn.setAttribute("rx", "3");
        barIn.setAttribute("class", "svg-bar-in");
        
        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = `Cash In: ${formatCurrency(m.in)}`;
        barIn.appendChild(title);
        chartSvg.appendChild(barIn);
      }

      // Draw Expense Bar (Purple)
      if (outHeight > 0) {
        const barOut = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        barOut.setAttribute("x", x + 9);
        barOut.setAttribute("y", 200 - outHeight);
        barOut.setAttribute("width", barWidth);
        barOut.setAttribute("height", outHeight);
        barOut.setAttribute("rx", "3");
        barOut.setAttribute("class", "svg-bar-out");
        
        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = `Cash Out: ${formatCurrency(m.out)}`;
        barOut.appendChild(title);
        chartSvg.appendChild(barOut);
      }

      // Draw Month Label
      const lbl = document.createElementNS("http://www.w3.org/2000/svg", "text");
      lbl.setAttribute("x", x + 8);
      lbl.setAttribute("y", "215");
      lbl.setAttribute("fill", "var(--soft)");
      lbl.setAttribute("font-size", "9");
      lbl.setAttribute("font-family", "var(--font-display)");
      lbl.setAttribute("font-weight", "600");
      lbl.setAttribute("text-anchor", "middle");
      lbl.textContent = m.label;
      chartSvg.appendChild(lbl);
    });
  }

  function formatShortCurrency(num) {
    if (num >= 1000) {
      return "$" + (num / 1000).toFixed(1) + "k";
    }
    return "$" + Math.round(num);
  }

  // Event Listeners for Transaction Type select category update
  typeSelect.addEventListener("change", updateCategoryOptions);

  // Add Transaction Form submit
  transactionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newT = {
      id: Date.now().toString(),
      date: document.getElementById("t-date").value,
      type: typeSelect.value,
      description: document.getElementById("t-description").value.trim(),
      category: categorySelect.value,
      amount: parseFloat(document.getElementById("t-amount").value),
      client: document.getElementById("t-client").value.trim() || ""
    };

    state.transactions.push(newT);
    saveState();
    
    // Reset fields
    document.getElementById("t-description").value = "";
    document.getElementById("t-amount").value = "";
    document.getElementById("t-client").value = "";
  });

  // Add Invoice Form submit
  invoiceForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newInv = {
      id: Date.now().toString(),
      number: document.getElementById("inv-number").value.trim(),
      client: document.getElementById("inv-client").value.trim(),
      amount: parseFloat(document.getElementById("inv-amount").value),
      due: document.getElementById("inv-due").value,
      status: "unpaid"
    };

    state.invoices.push(newInv);
    saveState();

    // Reset fields
    document.getElementById("inv-number").value = "";
    document.getElementById("inv-client").value = "";
    document.getElementById("inv-amount").value = "";
  });

  // Filter actions
  filterType.addEventListener("change", renderTransactions);
  filterCategory.addEventListener("change", renderTransactions);

  // Storage / Data Actions
  btnExportJson.addEventListener("click", () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "logos_ledger_export.json");
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  });

  btnExportCsv.addEventListener("click", () => {
    let csvContent = "data:text/csv;charset=utf-8,Date,Type,Description,Category,Client,Amount\n";
    state.transactions.forEach(t => {
      const row = `"${t.date}","${t.type.toUpperCase()}","${t.description.replace(/"/g, '""')}","${t.category}","${t.client.replace(/"/g, '""')}",${t.amount}\n`;
      csvContent += row;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "logos_ledger_transactions.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  });

  btnImport.addEventListener("click", () => {
    inputFile.click();
  });

  inputFile.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.transactions && parsed.invoices) {
          state = parsed;
          saveState();
        } else {
          alert("Invalid file structure. Make sure it is a valid Logos & Ledger JSON export.");
        }
      } catch (err) {
        alert("Could not parse file. Verify it is valid JSON.");
      }
    };
    reader.readAsText(file);
  });

  btnClear.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset the ledger? This will clear all transactions and invoices from browser storage.")) {
      state = { transactions: [], invoices: [] };
      saveState();
    }
  });

  // App Initialization
  updateCategoryOptions();
  populateFilterCategories();
  updateDashboard();
});

// State Management
let stock = {
  Beans: { tonnage: 0, price: 0 },
  'Grain Maize': { tonnage: 0, price: 0 },
  'Cow peas': { tonnage: 0, price: 0 },
  'G-nuts': { tonnage: 0, price: 0 },
  Soybeans: { tonnage: 0, price: 0 },
};

let totals = { revenue: 0, tonnage: 0 };
let currentUser = '';

// Login Logic
function login(role) {
  currentUser = role;
  document.getElementById('loginOverlay').style.display = 'none';
  document.getElementById('userBadge').innerText = 'User: ' + role;
  applyPermissions();
}

function applyPermissions() {
  const tabs = {
    proc: document.getElementById('nav-procurement-tab'),
    sale: document.getElementById('nav-sales-tab'),
    cred: document.getElementById('nav-credit-tab'),
    dir: document.getElementById('nav-director-tab'),
  };

  // Reset visibility
  Object.values(tabs).forEach((t) => t.classList.remove('d-none'));

  if (currentUser === 'SalesAgent') {
    tabs.proc.classList.add('d-none');
    tabs.dir.classList.add('d-none');
    showTab('nav-sales-tab');
  } else if (currentUser === 'Manager') {
    tabs.dir.classList.add('d-none');
    showTab('nav-procurement-tab');
  } else {
    showTab('nav-director-tab');
  }
}

function showTab(id) {
  const el = document.querySelector(`#${id}`);
  bootstrap.Tab.getOrCreateInstance(el).show();
}

// Procurement Submission
document
  .getElementById('procurementForm')
  .addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('procName').value;
    const qty = parseFloat(document.getElementById('procTonnage').value);
    const price = parseFloat(document.getElementById('sellPrice').value);

    stock[name].tonnage += qty;
    stock[name].price = price;

    alert(`Stock Updated: ${name} now has ${stock[name].tonnage}kg`);
    this.reset();
    populateSales();
  });

// Sales Logic with Stock Alert
function populateSales() {
  const select = document.getElementById('saleProduce');
  select.innerHTML = '<option value="">Choose...</option>';
  for (let item in stock) {
    if (stock[item].tonnage > 0) {
      let opt = document.createElement('option');
      opt.value = item;
      opt.innerText = item;
      select.appendChild(opt);
    }
  }
}

function updateStockDisplay() {
  const name = document.getElementById('saleProduce').value;
  const info = document.getElementById('stockLevelDisplay');
  if (name) {
    info.innerText = `Stock: ${stock[name].tonnage}kg | Price: UgX ${stock[name].price}`;
  }
}

document.getElementById('salesForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('saleProduce').value;
  const qty = parseFloat(document.getElementById('saleTonnage').value);
  const paid = parseFloat(document.getElementById('salePaid').value);

  if (qty > stock[name].tonnage) {
    // Business Rule: Notify Manager if out of stock
    showStockAlert(
      `Insufficient stock for ${name}! Please notify the Manager immediately.`
    );
    return;
  }

  stock[name].tonnage -= qty;
  totals.revenue += paid;
  totals.tonnage += qty;

  // Aggregates for Director
  document.getElementById('totalRev').innerText =
    `UgX ${totals.revenue.toLocaleString()}`;
  document.getElementById('totalTon').innerText =
    `${totals.tonnage.toLocaleString()} kg`;

  alert('Sale Recorded Successfully!');
  updateStockDisplay();
  this.reset();
});

function showStockAlert(msg) {
  const container = document.getElementById('alertContainer');
  container.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>Stock Alert:</strong> ${msg}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
}

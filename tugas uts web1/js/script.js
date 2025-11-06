function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("modal")) {
    e.target.classList.remove("active");
    document.body.style.overflow = "auto";
  }
});

function showAlert(type, message) {
  const existingAlerts = document.querySelectorAll(".alert");
  existingAlerts.forEach((alert) => alert.remove());

  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;

  const icon =
    type === "success"
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';

  alert.innerHTML = `${icon}<span>${message}</span>`;
  document.body.appendChild(alert);

  setTimeout(() => {
    alert.style.opacity = "0";
    alert.style.transform = "translateX(100%)";
    setTimeout(() => alert.remove(), 300);
  }, 3000);
}

function checkAuth() {
  const user = localStorage.getItem("user");
  if (!user) {
    window.location.href = "index.html";
    return false;
  }
  return true;
}

function getCurrentUser() {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^[\d\s\-\+\(\)]+$/;
  return re.test(phone) && phone.replace(/\D/g, "").length >= 10;
}

function sanitizeInput(input) {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
}

function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return false;

  const inputs = form.querySelectorAll("input[required], select[required]");
  let isValid = true;

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      isValid = false;
      input.style.borderColor = "var(--error)";
    } else {
      input.style.borderColor = "var(--border)";

      if (input.type === "email" && !validateEmail(input.value)) {
        isValid = false;
        input.style.borderColor = "var(--error)";
      }

      if (input.type === "tel" && !validatePhone(input.value)) {
        isValid = false;
        input.style.borderColor = "var(--error)";
      }
    }
  });

  return isValid;
}

function formatCurrency(number) {
  return "Rp " + number.toLocaleString("id-ID");
}

function parseCurrency(currencyStr) {
  return parseInt(currencyStr.replace(/[^0-9]/g, ""));
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Selamat Pagi";
  if (hour < 15) return "Selamat Siang";
  if (hour < 18) return "Selamat Sore";
  return "Selamat Malam";
}

function formatDate(dateString) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("id-ID", options);
}

const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error("Storage error:", e);
      return false;
    }
  },
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error("Storage error:", e);
      return null;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error("Storage error:", e);
      return false;
    }
  },
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.error("Storage error:", e);
      return false;
    }
  },
};

function smoothScroll(target) {
  const element = document.querySelector(target);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

function setLoading(buttonElement, isLoading) {
  if (isLoading) {
    buttonElement.disabled = true;
    buttonElement.dataset.originalText = buttonElement.textContent;
    buttonElement.textContent = "Loading...";
  } else {
    buttonElement.disabled = false;
    buttonElement.textContent = buttonElement.dataset.originalText;
  }
}

function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      showAlert("success", "Berhasil disalin ke clipboard");
    })
    .catch((err) => {
      showAlert("error", "Gagal menyalin: " + err);
    });
}

function printPage() {
  window.print();
}

function exportToCSV(data, filename) {
  const csv = data.map((row) => Object.values(row).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename + ".csv";
  a.click();
  window.URL.revokeObjectURL(url);
}

function initTooltips() {
  const tooltips = document.querySelectorAll("[data-tooltip]");
  tooltips.forEach((element) => {
    element.addEventListener("mouseenter", function () {
      const tooltip = document.createElement("div");
      tooltip.className = "tooltip";
      tooltip.textContent = this.dataset.tooltip;
      document.body.appendChild(tooltip);

      const rect = this.getBoundingClientRect();
      tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + "px";
      tooltip.style.left =
        rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px";
    });

    element.addEventListener("mouseleave", function () {
      const tooltips = document.querySelectorAll(".tooltip");
      tooltips.forEach((t) => t.remove());
    });
  });
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    const activeModals = document.querySelectorAll(".modal.active");
    activeModals.forEach((modal) => {
      modal.classList.remove("active");
      document.body.style.overflow = "auto";
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = this.getAttribute("href");
      if (target !== "#") {
        smoothScroll(target);
      }
    });
  });

  initTooltips();

  const emailInputs = document.querySelectorAll('input[type="email"]');
  emailInputs.forEach((input) => {
    input.addEventListener("blur", function () {
      if (this.value && !validateEmail(this.value)) {
        this.style.borderColor = "var(--error)";
        showAlert("error", "Format email tidak valid");
      } else {
        this.style.borderColor = "var(--border)";
      }
    });
  });
});

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function checkForUpdates() {
  console.log("Checking for updates...");
}

function initCheckoutPage() {
  if (!document.getElementById("bookSelection")) return;

  checkAuth();
  let cart = [];

  function renderBooks() {
    const container = document.getElementById("bookSelection");
    container.innerHTML = dataKatalogBuku
      .map(
        (book) => `
        <div class="book-select-item" onclick='addToCart(${JSON.stringify(
          book
        )})'>
          <div>
            <h4>${book.namaBarang}</h4>
            <p class="book-code">${book.kodeBarang}</p>
          </div>
          <div class="book-select-info">
            <div class="price">${book.harga}</div>
            <div class="stock">Stok: ${book.stok}</div>
          </div>
        </div>`
      )
      .join("");
  }

  window.addToCart = function (book) {
    const existing = cart.find((i) => i.kodeBarang === book.kodeBarang);
    if (existing) existing.quantity++;
    else cart.push({ ...book, quantity: 1 });
    updateCart();
    showAlert("success", `${book.namaBarang} ditambahkan ke keranjang`);
  };

  function parsePrice(price) {
    return parseInt(price.replace(/[^0-9]/g, ""));
  }

  function formatPrice(num) {
    return "Rp " + num.toLocaleString("id-ID");
  }

  window.updateQuantity = function (kode, change) {
    const item = cart.find((i) => i.kodeBarang === kode);
    if (item) {
      item.quantity = Math.max(1, item.quantity + change);
      updateCart();
    }
  };

  window.removeFromCart = function (kode) {
    cart = cart.filter((i) => i.kodeBarang !== kode);
    updateCart();
    showAlert("success", "Item dihapus dari keranjang");
  };

  function updateCart() {
    const container = document.getElementById("cartItems");
    const summary = document.getElementById("cartSummary");
    const count = document.getElementById("cartCount");

    count.textContent = cart.length;

    if (cart.length === 0) {
      container.innerHTML = `<p class="empty-cart">Keranjang masih kosong</p>`;
      summary.style.display = "none";
      return;
    }

    container.innerHTML = cart
      .map(
        (item) => `
        <div class="cart-item">
          <div class="cart-item-header">
            <span class="cart-item-name">${item.namaBarang}</span>
            <button class="btn-icon" onclick="removeFromCart('${
              item.kodeBarang
            }')">
              🗑️
            </button>
          </div>
          <div class="cart-item-controls">
            <button class="btn-qty" onclick="updateQuantity('${
              item.kodeBarang
            }', -1)">−</button>
            <span class="qty">${item.quantity}</span>
            <button class="btn-qty" onclick="updateQuantity('${
              item.kodeBarang
            }', 1)">+</button>
            <span class="cart-item-price">${formatPrice(
              parsePrice(item.harga) * item.quantity
            )}</span>
          </div>
        </div>`
      )
      .join("");

    const total = cart.reduce(
      (sum, item) => sum + parsePrice(item.harga) * item.quantity,
      0
    );
    document.getElementById("subtotal").textContent = formatPrice(total);
    document.getElementById("total").textContent = formatPrice(total);
    summary.style.display = "block";
  }

  window.processOrder = function () {
    const form = document.getElementById("checkoutForm");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (cart.length === 0) {
      showAlert("error", "Keranjang masih kosong");
      return;
    }
    showAlert("success", "Pesanan berhasil dibuat!");
    cart = [];
    updateCart();
    form.reset();
  };

  renderBooks();
}

document.addEventListener("DOMContentLoaded", initCheckoutPage);

function initTrackingPage() {
  if (!document.getElementById("trackingForm")) return;

  checkAuth();

  const form = document.getElementById("trackingForm");
  const resultSection = document.getElementById("trackingResult");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const trackingNumber = document.getElementById("trackingNumber").value;
    const data = dataTracking[trackingNumber];

    if (data) {
      displayTracking(data);
      showAlert("success", "Data pengiriman ditemukan!");
    } else {
      resultSection.style.display = "none";
      showAlert("error", "Nomor DO tidak ditemukan");
    }
  });

  function displayTracking(data) {
    resultSection.style.display = "block";
    document.getElementById("customerName").textContent = data.nama;
    document.getElementById(
      "trackingInfo"
    ).textContent = `DO: ${data.nomorDO} • ${data.ekspedisi}`;
    document.getElementById("tanggalKirim").textContent = data.tanggalKirim;
    document.getElementById("paket").textContent = data.paket;
    document.getElementById("total").textContent = data.total;

    const statusBadge = document.getElementById("statusBadge");
    statusBadge.textContent = data.status;
    statusBadge.className =
      "status-badge " +
      (data.status === "Dikirim" ? "status-success" : "status-warning");

    const progress = data.status === "Dikirim" ? 100 : 50;
    document.getElementById("progressPercent").textContent = progress + "%";
    document.getElementById("progressFill").style.width = progress + "%";

    const timeline = document.getElementById("timeline");
    timeline.innerHTML = data.perjalanan
      .map(
        (item, index) => `
          <div class="timeline-item">
            <div class="timeline-dot ${index === 0 ? "active" : ""}"></div>
            <div class="timeline-content">
              <div class="timeline-time">${item.waktu}</div>
              <div class="timeline-text">${item.keterangan}</div>
            </div>
          </div>`
      )
      .join("");
  }
}

document.addEventListener("DOMContentLoaded", initTrackingPage);

function initHistoryPage() {
  if (!document.getElementById("historyTable")) return;

  checkAuth();

  const tbody = document.getElementById("historyBody");

  if (!dataHistory || dataHistory.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#888">Belum ada riwayat pemesanan.</td></tr>`;
    return;
  }

  tbody.innerHTML = dataHistory
    .map(
      (item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${item.tanggal}</td>
        <td>${item.nomorDO}</td>
        <td>${item.namaBuku}</td>
        <td>${item.total}</td>
        <td><span class="status ${item.status.toLowerCase()}">${
        item.status
      }</span></td>
      </tr>
    `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", initHistoryPage);

function initStokPage() {
  if (!document.getElementById("stokTable")) return;
  checkAuth();

  const user = getCurrentUser();
  const tbody = document.getElementById("stokBody");
  const addBtn = document.getElementById("addBookBtn");
  const gridContainer = document.getElementById("bookGrid");

  if (user && user.role === "Admin") {
    addBtn.style.display = "inline-block";
  }

  let katalog = storage.get("dataKatalogBuku") || dataKatalogBuku;

  function renderTable() {
    tbody.innerHTML = katalog
      .map(
        (buku, i) => `
      <tr>
        <td>${buku.kodeBarang}</td>
        <td>${buku.namaBarang}</td>
        <td>${buku.jenisBarang}</td>
        <td>${buku.edisi}</td>
        <td>${buku.stok}</td>
        <td>${buku.harga}</td>
        <td class="actions">
          ${
            user.role === "Admin"
              ? `
            <button class="edit-btn" onclick="editBook(${i})">Edit</button>
            <button class="delete-btn" onclick="deleteBook(${i})">Hapus</button>
            `
              : "-"
          }
        </td>
      </tr>`
      )
      .join("");
  }

  function renderGrid() {
    if (!gridContainer) return;
    gridContainer.innerHTML = katalog
      .map(
        (buku) => `
      <div class="book-card">
        <div class="book-cover">
          <img src="${buku.cover || "img/default-cover.jpg"}" alt="${
          buku.namaBarang
        }" />
        </div>
        <div class="book-info">
          <div class="book-title">${buku.namaBarang}</div>
          <div class="book-subtitle">${buku.jenisBarang}</div>
        </div>
      </div>`
      )
      .join("");
  }

  window.openAddBook = function () {
    document.getElementById("stokModalTitle").textContent = "Tambah Buku";
    document.getElementById("stokForm").reset();
    document.getElementById("editIndex").value = "";
    openModal("stokModal");
  };

  window.editBook = function (index) {
    const buku = katalog[index];
    document.getElementById("stokModalTitle").textContent = "Edit Buku";
    document.getElementById("editIndex").value = index;
    document.getElementById("kodeBarang").value = buku.kodeBarang;
    document.getElementById("namaBarang").value = buku.namaBarang;
    document.getElementById("jenisBarang").value = buku.jenisBarang;
    document.getElementById("edisi").value = buku.edisi;
    document.getElementById("stok").value = buku.stok;
    document.getElementById("harga").value = buku.harga;
    openModal("stokModal");
  };

  window.deleteBook = function (index) {
    if (confirm("Yakin ingin menghapus buku ini?")) {
      katalog.splice(index, 1);
      storage.set("dataKatalogBuku", katalog);
      renderTable();
      renderGrid();
      showAlert("success", "Data buku berhasil dihapus");
    }
  };

  window.saveBook = function () {
    const kode = document.getElementById("kodeBarang").value;
    const nama = document.getElementById("namaBarang").value;
    const jenis = document.getElementById("jenisBarang").value;
    const edisi = document.getElementById("edisi").value;
    const stok = document.getElementById("stok").value;
    const harga = document.getElementById("harga").value;
    const idx = document.getElementById("editIndex").value;

    const newBook = {
      kodeBarang: kode,
      namaBarang: nama,
      jenisBarang: jenis,
      edisi,
      stok,
      harga,
      cover: "img/default-cover.jpg",
    };

    if (idx === "") {
      katalog.push(newBook);
      showAlert("success", "Buku baru berhasil ditambahkan");
    } else {
      katalog[idx] = newBook;
      showAlert("success", "Data buku berhasil diperbarui");
    }

    storage.set("dataKatalogBuku", katalog);
    closeModal("stokModal");
    renderTable();
    renderGrid();
  };

  addBtn.addEventListener("click", openAddBook);
  renderTable();
  renderGrid();
}


const correctPassword = "1234";
let products = [
  { name: "ลูกชิ้นหมู", price: 10 },
  { name: "ลูกชิ้นเนื้อ", price: 15 },
];
const cart = {};

function checkLogin() {
  const pw = document.getElementById("password").value;
  if (pw === correctPassword) {
    document.getElementById("login").style.display = "none";
    document.getElementById("main").style.display = "block";
    renderProducts();
    renderAdmin();
    updateCart();
  } else {
    alert("รหัสผ่านไม่ถูกต้อง");
  }
}

function renderProducts() {
  const list = document.getElementById('product-list');
  list.innerHTML = '';
  products.forEach((p, i) => {
    const btn = `<button onclick="addToCart(${i})">เพิ่ม</button>`;
    list.innerHTML += `<p>${p.name} ${p.price} บาท ${btn}</p>`;
  });
}

function renderAdmin() {
  const list = document.getElementById('admin-products');
  list.innerHTML = '';
  products.forEach((p, i) => {
    list.innerHTML += `<li>${p.name} (${p.price} บาท) 
      <button onclick="removeProduct(${i})">ลบ</button></li>`;
  });
}

function addProduct() {
  const name = document.getElementById("new-name").value;
  const price = parseInt(document.getElementById("new-price").value);
  if (!name || isNaN(price)) return alert("กรุณากรอกชื่อและราคาสินค้าให้ครบ");
  products.push({ name, price });
  renderProducts();
  renderAdmin();
}

function removeProduct(index) {
  products.splice(index, 1);
  renderProducts();
  renderAdmin();
}

function addToCart(index) {
  const item = products[index];
  if (!cart[item.name]) cart[item.name] = { qty: 0, price: item.price };
  cart[item.name].qty++;
  updateCart();
}

function updateCart() {
  const ul = document.getElementById('cart');
  const totalEl = document.getElementById('total');
  ul.innerHTML = '';
  let total = 0;
  for (const name in cart) {
    const { qty, price } = cart[name];
    const li = document.createElement('li');
    li.textContent = `${name} x${qty} = ${qty * price} บาท`;
    ul.appendChild(li);
    total += qty * price;
  }
  totalEl.textContent = total;
  localStorage.setItem('cart', JSON.stringify(cart));
}

function checkout() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  if (!name || !phone) return alert("กรุณากรอกชื่อและเบอร์โทร");

  let msg = `📦 ออเดอร์ใหม่จาก ${name} (${phone})\n`;
  for (const item in cart) {
    msg += `- ${item} x${cart[item].qty}\n`;
  }

  alert("ส่งออเดอร์แล้ว! ขอบคุณครับ");

  // ส่งแจ้งเตือนเข้า LINE (ต้องใส่ token จริงเอง)
  const token = "ใส่ LINE Notify Token ที่นี่";
  fetch("https://notify-api.line.me/api/notify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Bearer " + token
    },
    body: "message=" + encodeURIComponent(msg)
  });

  localStorage.removeItem('cart');
}

function toggleTheme() {
  document.body.classList.toggle('dark');
}

window.onload = () => {
  const saved = localStorage.getItem('cart');
  if (saved) Object.assign(cart, JSON.parse(saved));
  updateCart();
};

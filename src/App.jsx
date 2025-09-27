import React, { useState, useEffect } from "react";

const initialProducts = [
  { id: 1, name: "Bánh nướng 150 g - Thập cẩm", price: 60000 },
  { id: 2, name: "Bánh nướng 150 g - Đậu xanh", price: 50000 },
  { id: 3, name: "Bánh nướng 150 g - Khoai môn", price: 50000 },
  { id: 4, name: "Bánh nướng 150 g - Trà xanh", price: 50000 },
  { id: 5, name: "Bánh nướng 150 g - Mochi khoai môn", price: 55000 },
  { id: 6, name: "Bánh nướng 150 g - Mochi chà bông", price: 55000 },
  { id: 7, name: "Bánh nướng 150 g - Thập cẩm trứng", price: 65000 },
  { id: 8, name: "Bánh nướng 150 g - Đậu xanh trứng", price: 55000 },
  { id: 9, name: "Bánh nướng 150 g - Sen nhuyễn", price: 55000 },
  { id: 10, name: "Bánh nướng 150 g - Khoai môn trứng", price: 55000 },

  { id: 11, name: "Bánh dẻo 200 g - Thập cẩm", price: 60000 },
  { id: 12, name: "Bánh dẻo 200 g - Đậu xanh", price: 55000 },
  { id: 13, name: "Bánh dẻo 200 g - Khoai môn", price: 55000 },
  { id: 14, name: "Bánh dẻo 200 g - Trà xanh", price: 55000 },
  { id: 15, name: "Bánh dẻo 200 g - Thập cẩm trứng", price: 65000 },
  { id: 16, name: "Bánh dẻo 200 g - Đậu xanh trứng", price: 55000 },
  { id: 17, name: "Bánh dẻo 200 g - Khoai môn trứng", price: 55000 },

  { id: 18, name: "Hộp 4 bánh - Hoa Sen", price: 50000 },
  { id: 19, name: "Hộp 4 bánh - Con cò", price: 50000 },

  { id: 20, name: "Hộp 2 bánh - Hoa Cúc trắng", price: 30000 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("customers");

  const [products, setProducts] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("products");
      return stored ? JSON.parse(stored) : initialProducts;
    }
    return initialProducts;
  });

  const [customers, setCustomers] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("customers");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  // ==== Product form state ====
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [editingProductId, setEditingProductId] = useState(null);

  // ==== Customer form state ====
  const [customerName, setCustomerName] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [editingCustomerIndex, setEditingCustomerIndex] = useState(null);

  // Sync localStorage when products/customers change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("customers", JSON.stringify(customers));
    }
  }, [customers]);

  // -------- Products handlers --------
  function resetProductForm() {
    setProductName("");
    setProductPrice("");
    setEditingProductId(null);
  }

  function addOrUpdateProduct() {
    if (!productName.trim() || !productPrice) {
      alert("Vui lòng nhập tên và giá sản phẩm");
      return;
    }
    if (isNaN(productPrice) || Number(productPrice) <= 0) {
      alert("Giá sản phẩm phải là số lớn hơn 0");
      return;
    }

    if (editingProductId !== null) {
      // Update
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProductId
            ? { ...p, name: productName.trim(), price: parseFloat(productPrice) }
            : p
        )
      );
      resetProductForm();
    } else {
      // Add new
      const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
      setProducts([
        ...products,
        { id: newId, name: productName.trim(), price: parseFloat(productPrice) },
      ]);
      resetProductForm();
    }
  }

  // -------- Customers handlers --------

  function resetCustomerForm() {
    setCustomerName("");
    setSelectedProduct("");
    setQuantity(1);
    setEditingCustomerIndex(null);
  }

  function addOrUpdateCustomer() {
    if (
      !customerName.trim() ||
      !selectedProduct ||
      quantity < 1 ||
      isNaN(quantity)
    ) {
      alert("Vui lòng điền đầy đủ thông tin khách hàng");
      return;
    }
    const product = products.find((p) => p.name === selectedProduct);
    if (!product) {
      alert("Sản phẩm không tồn tại");
      return;
    }
    const total = product.price * quantity;

    if (editingCustomerIndex !== null) {
      setCustomers((prev) =>
        prev.map((c, i) =>
          i === editingCustomerIndex
            ? { name: customerName.trim(), product: selectedProduct, quantity, total }
            : c
        )
      );
      resetCustomerForm();
    } else {
      setCustomers((prev) => [
        ...prev,
        { name: customerName.trim(), product: selectedProduct, quantity, total },
      ]);
      resetCustomerForm();
    }
  }

  function editCustomer(index) {
    const c = customers[index];
    setCustomerName(c.name);
    setSelectedProduct(c.product);
    setQuantity(c.quantity);
    setEditingCustomerIndex(index);
  }

  function deleteCustomer(index) {
    if (!window.confirm("Xóa khách hàng này?")) return;
    setCustomers((prev) => prev.filter((_, i) => i !== index));
  }

  // Tổng doanh thu
  const totalRevenue = customers.reduce((sum, c) => sum + c.total, 0);

  // Nhóm khách hàng theo tên + tổng tiền
  const groupedCustomers = customers.reduce((acc, cur) => {
    if (!acc[cur.name]) acc[cur.name] = { total: 0, items: [] };
    acc[cur.name].total += cur.total;
    acc[cur.name].items.push(cur);
    return acc;
  }, {});

  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const uniqueCustomerNames = [...new Set(customers.map(c => c.name))];


  return (
    <div style={styles.container}>
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>
        Ứng dụng quản lý bán hàng
      </h1>

      <div style={styles.tabs}>
        <button
          style={activeTab === "customers" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("customers")}
        >
          Thêm khách hàng
        </button>
        <button
          style={activeTab === "products" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("products")}
        >
          Thêm sản phẩm
        </button>
      </div>

      {activeTab === "customers" && (
        <div style={styles.form}>
          <select
            style={styles.input}
            value={isNewCustomer ? "__new__" : customerName}
            onChange={(e) => {
              if (e.target.value === "__new__") {
                setIsNewCustomer(true);
                setCustomerName("");
              } else {
                setIsNewCustomer(false);
                setCustomerName(e.target.value);
              }
            }}
          >
            <option value="">Chọn khách hàng</option>
            {uniqueCustomerNames.map((name, i) => (
              <option key={i} value={name}>
                {name}
              </option>
            ))}
            <option value="__new__">Khách hàng mới</option>
          </select>

          {isNewCustomer && (
            <input
              style={styles.input}
              placeholder="Nhập tên khách hàng mới"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          )}
          <select
            style={styles.input}
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">Chọn sản phẩm</option>
            {products.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name} (
                {p.price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
                )
              </option>
            ))}
          </select>
          <input
            style={styles.input}
            placeholder="Số lượng"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />

          <div style={{ display: "flex", gap: 10 }}>
            <button style={styles.button} onClick={addOrUpdateCustomer}>
              {editingCustomerIndex !== null ? "Lưu" : "Thêm khách hàng"}
            </button>
            {editingCustomerIndex !== null && (
              <button
                style={{ ...styles.button, backgroundColor: "#888" }}
                onClick={resetCustomerForm}
              >
                Hủy
              </button>
            )}
          </div>

          <h3>Danh sách khách hàng</h3>
          {customers.length === 0 && <p>Chưa có khách hàng nào</p>}
          <ul>
            {customers.map((c, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                <strong>{c.name}</strong> mua {c.quantity} × {c.product} ={" "}
                {c.total.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}{" "}
                <button onClick={() => editCustomer(i)} style={styles.smallBtn}>
                  Sửa
                </button>{" "}
                <button onClick={() => deleteCustomer(i)} style={styles.smallBtnDelete}>
                  Xóa
                </button>
              </li>
            ))}
          </ul>

          {/* Bảng tổng hợp */}
          <h3 style={{ marginTop: 30 }}>Bảng tổng hợp theo khách hàng</h3>
          {customers.length === 0 ? (
            <p>Chưa có dữ liệu tổng hợp</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Tên khách hàng</th>
                  <th style={styles.th}>Sản phẩm</th>
                  <th style={styles.th}>Số lượng</th>
                  <th style={styles.th}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedCustomers).map(([customerName, data]) => (
                  <React.Fragment key={customerName}>
                    {data.items.map((item, idx) => (
                      <tr key={idx}>
                        {idx === 0 && (
                          <td
                            rowSpan={data.items.length}
                            style={{ ...styles.td, fontWeight: "bold" }}
                          >
                            {customerName}
                          </td>
                        )}
                        <td style={styles.td}>{item.product}</td>
                        <td style={styles.td}>{item.quantity}</td>
                        <td style={styles.td}>
                          {item.total.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ backgroundColor: "#f0f0f0", fontWeight: "bold" }}>
                      <td colSpan={2} style={styles.td}>
                        Tổng cộng:
                      </td>
                      <td style={styles.td}>
                        {data.items.reduce((sum, i) => sum + i.quantity, 0)}
                      </td>
                      <td style={styles.td}>
                        {data.total.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ fontWeight: "bold", backgroundColor: "#ddd" }}>
                  <td colSpan={2} style={styles.td}>
                    Tổng cộng tất cả khách:
                  </td>
                  <td style={styles.td}>
                    {customers.reduce((sum, c) => sum + c.quantity, 0)}
                  </td>
                  <td style={styles.td}>
                    {totalRevenue.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      )}

      {activeTab === "products" && (
        <div style={styles.form}>
          <input
            style={styles.input}
            placeholder="Tên sản phẩm"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="Giá sản phẩm"
            type="number"
            min={0}
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
          />

          <div style={{ display: "flex", gap: 10 }}>
            <button style={styles.button} onClick={addOrUpdateProduct}>
              {editingProductId !== null ? "Lưu" : "Thêm sản phẩm"}
            </button>
            {editingProductId !== null && (
              <button
                style={{ ...styles.button, backgroundColor: "#888" }}
                onClick={resetProductForm}
              >
                Hủy
              </button>
            )}
          </div>

          <h3>Danh sách sản phẩm</h3>
          {products.length === 0 && <p>Chưa có sản phẩm nào</p>}
          <ul>
            {products.map((p) => (
              <li key={p.id} style={{ marginBottom: 6 }}>
                <strong>{p.name}</strong> -{" "}
                {p.price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 1280,
    margin: "30px auto",
    padding: 20,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f9faff",
    borderRadius: 10,
    boxShadow: "0 0 15px rgba(0,0,0,0.1)",
  },
  tabs: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 20,
    gap: 10,
  },
  tab: {
    padding: "10px 20px",
    border: "1px solid #007bff",
    backgroundColor: "#e6f0ff",
    cursor: "pointer",
    borderRadius: 5,
    color: "#007bff",
    fontWeight: "600",
  },
  activeTab: {
    padding: "10px 20px",
    border: "1px solid #007bff",
    backgroundColor: "#007bff",
    cursor: "pointer",
    borderRadius: 5,
    color: "white",
    fontWeight: "600",
  },
  form: {
    maxWidth: 800,
    margin: "0 auto",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    border: "1px solid #ccc",
    fontSize: 16,
    boxSizing: "border-box",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: 5,
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: 16,
  },
  smallBtn: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    padding: "2px 8px",
    fontSize: 14,
    marginLeft: 6,
  },
  smallBtnDelete: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    padding: "2px 8px",
    fontSize: 14,
    marginLeft: 6,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 15,
  },
  th: {
    border: "1px solid #bbb",
    padding: 8,
    backgroundColor: "#b0c4de",
    textAlign: "center",
  },
  td: {
    border: "1px solid #bbb",
    padding: 8,
    textAlign: "center",
  },
};

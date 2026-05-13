const API = process.env.NEXT_PUBLIC_API_URL;

// ============================
// PRODUCTS
// ============================
export const getProducts = async () => {
  const res = await fetch(`${API}/products`);

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
};

// ============================
// CREATE ORDER (PUBLIC - CUSTOMER)
// ============================
export const createOrder = async (data: any) => {
  const res = await fetch(`${API}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Order creation failed");
  }

  return result;
};

// ============================
// GET ORDERS (STAFF / ADMIN)
// ============================
export const getOrders = async (token: string) => {
  const res = await fetch(`${API}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  return res.json();
};

// ============================
// UPDATE ORDER STATUS (STAFF / KITCHEN)
// ============================
export const updateOrderStatus = async (
  id: string,
  status: string,
  token: string
) => {
  const res = await fetch(`${API}/orders/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error("Failed to update order");
  }

  return res.json();
};

// ============================
// GET ORDER BY ID (CUSTOMER TRACKING)
// ============================
export const getOrderById = async (id: string) => {
  const res = await fetch(`${API}/orders/${id}`);

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Order not found");
  }

  return result;
};
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL;

/**
 * 🧾 GET PRODUCTS
 */
export const getProducts = async () => {
  const res = await fetch(
    `${BASE_URL}/products`
  );

  if (!res.ok) {
    throw new Error(
      "Failed to fetch products"
    );
  }

  return res.json();
};

/**
 * 🧾 CREATE ORDER
 */
export const createOrder = async (
  data: any
) => {
  const res = await fetch(
    `${BASE_URL}/orders`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(data),
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message ||
        "Order creation failed"
    );
  }

  return result;
};

/**
 * 📦 GET ALL ORDERS
 */
export const getOrders = async () => {
  const res = await fetch(
    `${BASE_URL}/orders`
  );

  if (!res.ok) {
    throw new Error(
      "Failed to fetch orders"
    );
  }

  return res.json();
};

/**
 * 🔍 GET ORDER BY ID
 */
export const getOrderById = async (
  id: string
) => {
  const res = await fetch(
    `${BASE_URL}/orders/${id}`
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message ||
        "Order not found"
    );
  }

  return result;
};
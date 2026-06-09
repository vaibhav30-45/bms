import Decimal from "decimal.js";

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "₹0.00";
  const value = new Decimal(amount);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(value.toNumber());
};

export const computeTotal = (weightKg, feePerKg) =>
  Number((Number(weightKg) * Number(feePerKg)).toFixed(2));

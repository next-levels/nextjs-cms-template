const TREES_PER_HECTARE = 625;
const BASE_TREE_VALUE = 255;
const YEARLY_INCREASE = 63.75;
const MAX_YEARS = 8;

function calculateValuePerTree(year: number): number {
  const currentYear = new Date().getFullYear();
  const yearsSincePurchase = currentYear - year;
  const yearsForCalculation = Math.min(yearsSincePurchase, MAX_YEARS);
  return Math.max(
    BASE_TREE_VALUE,
    BASE_TREE_VALUE + yearsForCalculation * YEARLY_INCREASE,
  );
}

function calculateHectares(trees: number): number {
  return Math.ceil(trees / TREES_PER_HECTARE);
}

export {
  calculateHectares,
  calculateValuePerTree,
  TREES_PER_HECTARE,
  BASE_TREE_VALUE,
  YEARLY_INCREASE,
  MAX_YEARS,
};

import { 
  MODULE_PRICING, 
  USER_SEAT_PRICE, 
  STORAGE_GB_PRICE, 
  BASE_PLATFORM_FEE, 
  getAppPrice,
  TIERS,
  BUNDLES,
  BILLING_PERIODS,
  VAT_RATE
} from '@/data/pricingModels';
import { appCategories } from '@/data/applications';

/**
 * Calculates the cost of a subscription configuration based on billing cycle.
 * 
 * @param {Object} config - The subscription configuration
 * @param {string[]} config.modules - List of fully enabled module IDs
 * @param {string[]} config.apps - List of individually enabled app IDs
 * @param {number} config.userCount - Number of users
 * @param {number} config.storageGB - Amount of storage in GB
 * @param {string} config.tierId - 'starter', 'growth', or 'enterprise'
 * @param {number} config.customDiscount - Percentage discount (0-100)
 * @param {string} config.billingCycle - 'monthly', 'quarterly', 'annual', '2year', '3year'
 * @returns {Object} Detailed pricing breakdown
 */
export const calculateSubscriptionCost = (config) => {
  const {
    modules = [],
    apps = [],
    userCount = 5,
    storageGB = 100,
    tierId = 'starter',
    customDiscount = 0,
    billingCycle = 'annual'
  } = config;

  let monthlySubtotal = BASE_PLATFORM_FEE;
  const breakdown = [];

  // 1. Base Platform Fee
  breakdown.push({ item: 'Platform Base Fee', cost: BASE_PLATFORM_FEE, type: 'base' });

  // 2. Modules Cost
  let modulesCost = 0;
  modules.forEach(modId => {
    const price = MODULE_PRICING[modId]?.basePrice || 0;
    modulesCost += price;
    breakdown.push({ item: `Module: ${MODULE_PRICING[modId]?.name || modId}`, cost: price, type: 'module' });
  });
  monthlySubtotal += modulesCost;

  // 3. Individual Apps Cost
  const standaloneApps = apps.filter(appId => {
    const parentModule = appCategories.find(cat => cat.apps.some(a => a.id === appId))?.id;
    return !modules.includes(parentModule);
  });

  let appsCost = 0;
  standaloneApps.forEach(appId => {
    const price = getAppPrice(appId);
    appsCost += price;
    let appName = appId;
    appCategories.forEach(c => {
      const found = c.apps.find(a => a.id === appId);
      if(found) appName = found.name;
    });
    breakdown.push({ item: `App: ${appName}`, cost: price, type: 'app' });
  });
  monthlySubtotal += appsCost;

  // 4. Tier Multiplier
  const tier = TIERS.find(t => t.id === tierId) || TIERS[0];
  const tierMultiplier = tier.multiplier;
  const preTierTotal = monthlySubtotal;
  
  if (tierMultiplier > 1) {
    const tierCost = (preTierTotal * tierMultiplier) - preTierTotal;
    monthlySubtotal = preTierTotal * tierMultiplier;
    breakdown.push({ item: `${tier.name} Tier Uplift (${Math.round((tierMultiplier-1)*100)}%)`, cost: tierCost, type: 'tier' });
  }

  // 5. User Seats
  const usersCost = userCount * USER_SEAT_PRICE;
  breakdown.push({ item: `${userCount} User Seats @ $${USER_SEAT_PRICE}/mo`, cost: usersCost, type: 'users' });
  monthlySubtotal += usersCost;

  // 6. Storage
  const storageCost = storageGB * STORAGE_GB_PRICE;
  breakdown.push({ item: `${storageGB}GB Storage @ $${STORAGE_GB_PRICE}/GB`, cost: storageCost, type: 'storage' });
  monthlySubtotal += storageCost;

  // 7. Automatic Bundle Discounts
  let bundleDiscountAmount = 0;
  if (modules.length === 6) {
    const fullBundle = BUNDLES.find(b => b.id === 'full_platform');
    if (fullBundle) {
        const discountableAmount = modulesCost + appsCost; 
        bundleDiscountAmount = discountableAmount * fullBundle.discount;
        breakdown.push({ item: `Bundle: ${fullBundle.name} (-${fullBundle.discount * 100}%)`, cost: -bundleDiscountAmount, type: 'discount' });
    }
  }
  monthlySubtotal -= bundleDiscountAmount;

  // 8. Custom Discount (Negotiated)
  let customDiscountAmount = 0;
  if (customDiscount > 0) {
    customDiscountAmount = monthlySubtotal * (customDiscount / 100);
    breakdown.push({ item: `Negotiated Discount (-${customDiscount}%)`, cost: -customDiscountAmount, type: 'discount' });
    monthlySubtotal -= customDiscountAmount;
  }

  // --- Billing Cycle Calculations ---
  
  const selectedPeriod = BILLING_PERIODS.find(p => p.id === billingCycle) || BILLING_PERIODS[2]; // Default Annual
  const months = selectedPeriod.months;
  const periodDiscountRate = selectedPeriod.discount;

  const grossContractValue = monthlySubtotal * months; // Value before period discount
  const periodDiscountAmount = grossContractValue * periodDiscountRate;
  const netContractValue = grossContractValue - periodDiscountAmount; // Subtotal (Net)
  const monthlyEquivalent = netContractValue / months;

  if (periodDiscountRate > 0) {
    breakdown.push({ 
      item: `${selectedPeriod.name} Billing Discount (-${periodDiscountRate * 100}%)`, 
      cost: -(periodDiscountAmount / months), // Show monthly impact in the list for consistency
      type: 'discount' 
    });
  }

  // --- VAT Calculation ---
  const vatAmount = netContractValue * VAT_RATE;
  const totalWithVat = netContractValue + vatAmount;

  return {
    monthlyTotal: monthlyEquivalent, // The effective monthly cost
    baseMonthlyTotal: monthlySubtotal, // The cost before period discount (monthly)
    totalContractValue: netContractValue, // Net subtotal before VAT
    vatAmount,
    totalWithVat,
    billingPeriod: selectedPeriod,
    savings: periodDiscountAmount,
    breakdown,
    config
  };
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};
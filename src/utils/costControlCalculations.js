import { differenceInDays, isValid, parseISO } from 'date-fns';

export const calculateMetrics = (afe, costItems, invoices) => {
  const totalBudget = costItems.reduce((sum, item) => sum + (Number(item.budget) || 0), 0);
  const totalCommitments = costItems.reduce((sum, item) => sum + (Number(item.commitment) || 0), 0);
  
  // Actuals can come from invoices or the cached 'actual' field on cost items. 
  // Using costItems.actual allows for manual accruals or non-invoice costs.
  const totalActuals = costItems.reduce((sum, item) => sum + (Number(item.actual) || 0), 0);
  
  // Calculate Forecast (EAC - Estimate At Completion)
  // Strategy: Use user-defined forecast if available and > 0, otherwise standard formula
  const totalForecast = costItems.reduce((sum, item) => {
    const itemBudget = Number(item.budget) || 0;
    const itemActual = Number(item.actual) || 0;
    const itemCommitment = Number(item.commitment) || 0;
    const itemForecast = Number(item.forecast) || 0;

    if (itemForecast > 0) return sum + itemForecast;
    
    // Default Logic: If we've spent more than budget, forecast is at least actuals.
    // Otherwise, assume budget is still the target unless explicitly changed.
    // A conservative approach: Max(Budget, Actuals + Commitments)
    return sum + Math.max(itemBudget, itemActual + itemCommitment);
  }, 0);

  const variance = totalBudget - totalForecast;
  
  // EVM Metrics
  // Weighted progress based on budget
  let earnedValue = 0;
  if (totalBudget > 0) {
    earnedValue = costItems.reduce((sum, item) => {
      const weight = (Number(item.budget) || 0);
      const progress = (Number(item.progress) || 0) / 100;
      return sum + (weight * progress);
    }, 0);
  }

  const cpi = totalActuals > 0 ? earnedValue / totalActuals : 1.0;
  const spi = totalBudget > 0 ? earnedValue / (totalBudget * calculateTimeProgress(afe)) : 1.0; // Simplified planned value based on time

  const percentSpent = totalBudget > 0 ? (totalActuals / totalBudget) * 100 : 0;
  
  // Overall Physical Percent Complete (Weighted)
  const percentComplete = totalBudget > 0 ? (earnedValue / totalBudget) * 100 : 0;

  return {
    totalBudget,
    totalCommitments,
    totalActuals,
    totalForecast,
    variance,
    earnedValue,
    cpi,
    spi,
    percentSpent,
    percentComplete
  };
};

const calculateTimeProgress = (afe) => {
  if (!afe?.start_date || !afe?.end_date) return 1.0;
  const start = parseISO(afe.start_date);
  const end = parseISO(afe.end_date);
  const now = new Date();

  if (!isValid(start) || !isValid(end)) return 1.0;
  if (now < start) return 0;
  if (now > end) return 1.0;

  const totalDuration = differenceInDays(end, start);
  const elapsed = differenceInDays(now, start);
  
  return totalDuration > 0 ? elapsed / totalDuration : 1.0;
};

export const generateSCurveData = (afe, costItems, invoices) => {
  if (!afe?.start_date || !afe?.end_date) return [];

  const start = new Date(afe.start_date);
  const end = new Date(afe.end_date);
  const totalBudget = costItems.reduce((sum, i) => sum + (Number(i.budget)||0), 0);
  const totalForecast = costItems.reduce((sum, i) => sum + (Number(i.forecast) || Math.max(Number(i.budget)||0, (Number(i.actual)||0) + (Number(i.commitment)||0))), 0);

  // Sort invoices
  const sortedInvoices = [...invoices].sort((a, b) => new Date(a.invoice_date) - new Date(b.invoice_date));

  const dataPoints = [];
  let currentDate = new Date(start);
  const now = new Date();

  let cumActual = 0;
  let cumPlanned = 0;
  let cumForecast = 0;

  const totalDays = differenceInDays(end, start);
  const dailyBudget = totalBudget / Math.max(totalDays, 1);
  const dailyForecast = totalForecast / Math.max(totalDays, 1);

  // Create monthly buckets roughly
  while (currentDate <= end || currentDate <= now) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const displayDate = currentDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    
    // Actuals (up to now)
    if (currentDate <= now) {
       // Sum invoices up to this date
       const invoicesUntilNow = sortedInvoices.filter(inv => new Date(inv.invoice_date) <= currentDate);
       cumActual = invoicesUntilNow.reduce((sum, inv) => sum + Number(inv.amount), 0);
    }

    // Planned (Linear distribution for simplicity, could be S-curve bell shaped in advanced version)
    const daysElapsed = differenceInDays(currentDate, start);
    if (daysElapsed >= 0) {
        cumPlanned = Math.min(totalBudget, daysElapsed * dailyBudget);
        
        // Forecast merges actuals + remaining projection
        if (currentDate <= now) {
            cumForecast = cumActual; 
        } else {
            // Project remaining forecast linearly from now to end
            // Simple approach: Linear projection to Total Forecast
            const totalForecastDays = differenceInDays(end, start);
            cumForecast = Math.min(totalForecast, daysElapsed * dailyForecast); 
        }
    }

    dataPoints.push({
      date: displayDate,
      Planned: Math.round(cumPlanned),
      Actual: currentDate <= now ? Math.round(cumActual) : null,
      Forecast: Math.round(cumForecast)
    });

    // Advance 1 month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  return dataPoints;
};
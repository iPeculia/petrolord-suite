export function calculateEVM(tasks, baselineBudget) {
  let plannedValue = 0;
  let earnedValue = 0;
  let actualCost = 0;

  // Assuming tasks have planned_cost, percent_complete, and actual_cost (for reporting)
  tasks.forEach(task => {
    const plannedCost = parseFloat(task.planned_cost) || 0;
    const percentComplete = parseFloat(task.percent_complete) || 0;
    const taskActualCost = parseFloat(task.actual_cost) || 0;

    // Simplified calculation for demo purposes:
    // Planned Value: Sum of planned costs for all tasks (or tasks that should have started/finished by now)
    // For simplicity, let's say PV is the sum of planned costs for all tasks in scope for this basic EVM.
    // In a real scenario, PV would be time-phased.
    plannedValue += plannedCost;
    
    // Earned Value: Budgeted cost of work performed (BCWP)
    earnedValue += plannedCost * (percentComplete / 100);

    // Actual Cost: Actual cost of work performed (ACWP)
    actualCost += taskActualCost;
  });

  const cpi = actualCost === 0 ? (earnedValue > 0 ? 1 : 0) : (earnedValue / actualCost); // Cost Performance Index
  const spi = plannedValue === 0 ? (earnedValue > 0 ? 1 : 0) : (earnedValue / plannedValue); // Schedule Performance Index
  const cv = earnedValue - actualCost; // Cost Variance
  const sv = earnedValue - plannedValue; // Schedule Variance

  return {
    plannedValue: plannedValue.toFixed(2),
    earnedValue: earnedValue.toFixed(2),
    actualCost: actualCost.toFixed(2),
    cpi: cpi.toFixed(2),
    spi: spi.toFixed(2),
    cv: cv.toFixed(2),
    sv: sv.toFixed(2),
    percentCompleteRaw: (earnedValue / plannedValue * 100).toFixed(2)
  };
}

export function formatTasksForGantt(tasks, project) {
  const ganttTasks = tasks.map(task => ({
    id: task.id,
    name: task.name,
    start: new Date(task.planned_start_date),
    end: new Date(task.planned_end_date),
    progress: task.percent_complete || 0,
    type: task.type === 'milestone' ? 'milestone' : 'task',
    project: project.name, // Link to project
    isDisabled: false, // For editing
    styles: { progressColor: '#84cc16', progressSelectedColor: '#65a30d' },
    // Custom data can be added here
    owner: task.owner,
    status: task.status
  }));

  // Add dependencies for Gantt if needed
  // This is a simplified example, actual dependency calculation can be complex
  ganttTasks.forEach(gTask => {
    const originalTask = tasks.find(t => t.id === gTask.id);
    if (originalTask?.predecessors?.length > 0) {
      gTask.dependencies = originalTask.predecessors;
    }
  });

  return ganttTasks;
}

export function calculateCPI(earnedValue, actualCost) {
  if (actualCost === 0) return earnedValue > 0 ? 1 : 0;
  return earnedValue / actualCost;
}

export function calculateSPI(earnedValue, plannedValue) {
  if (plannedValue === 0) return earnedValue > 0 ? 1 : 0;
  return earnedValue / plannedValue;
}
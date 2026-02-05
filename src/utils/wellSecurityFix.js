import { supabase } from '@/lib/customSupabaseClient';

/**
 * Utility to diagnose and handle Well RLS issues.
 */

export const checkWellRLSPolicies = async () => {
  try {
    // Try a dry-run select to see if we have access
    const { data, error } = await supabase
      .from('em_wells')
      .select('id')
      .limit(1);

    if (error) {
      console.error("RLS Policy Check Failed:", error);
      return {
        status: 'error',
        message: error.message,
        details: error
      };
    }

    return { status: 'ok', message: 'RLS policies appear to be allowing reads.' };
  } catch (err) {
    return { status: 'error', message: err.message };
  }
};

export const validateWellData = (wellData, userId) => {
  const errors = [];
  
  if (!wellData.name) errors.push("Well name is required.");
  if (!userId) errors.push("User ID is required for RLS compliance.");
  if (!wellData.project_id) errors.push("Project ID is required.");

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const handleSecurityError = (error) => {
  if (!error) return null;

  if (error.message && error.message.includes("row-level security policy")) {
    return {
      title: "Permission Denied",
      description: "You do not have permission to create wells in this project. Please ensure you are the project owner or have the correct role.",
      action: "Check Permissions"
    };
  }

  return {
    title: "Database Error",
    description: error.message || "An unknown error occurred.",
    action: "Retry"
  };
};
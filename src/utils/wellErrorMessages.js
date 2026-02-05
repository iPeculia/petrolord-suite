export const getWellErrorMessage = (error) => {
  if (!error) return "An unknown error occurred.";

  const msg = error.message || error.toString();

  if (msg.includes("row-level security policy")) {
    return {
      title: "Permission Denied",
      description: "Security policies prevented this action. Ensure you are logged in and have ownership rights to this project.",
      action: "Check Permissions",
      code: "RLS_VIOLATION"
    };
  }

  if (msg.includes("duplicate key")) {
    return {
      title: "Duplicate Well",
      description: "A well with this identifier already exists.",
      action: "Rename Well",
      code: "DUPLICATE_KEY"
    };
  }

  if (msg.includes("network") || msg.includes("fetch")) {
    return {
      title: "Network Error",
      description: "Unable to connect to the database. Please check your internet connection.",
      action: "Retry Connection",
      code: "NETWORK_ERROR"
    };
  }

  return {
    title: "Operation Failed",
    description: msg,
    action: "Try Again",
    code: "UNKNOWN_ERROR"
  };
};
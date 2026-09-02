export const formatDate = (dateString) => {

  // If there is no date
  if (!dateString) {
    return "N/A";
  }

  // Convert date into a readable format
  return new Date(dateString).toLocaleDateString(
    "en-IN",
    {
      year: "numeric",
      month: "short",
      day: "numeric"
    }
  );
};


export const formatDateTime = (dateString) => {

  // If there is no date
  if (!dateString) {
    return "N/A";
  }

  // Convert date and time into readable format
  return new Date(dateString).toLocaleString(
    "en-IN",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  );
};


export const getStatusColor = (status) => {

  const colors = {
    Pending: "#F59E0B",
    Assigned: "#3B82F6",
    "In Progress": "#8B5CF6",
    "Waiting for Parts": "#F97316",
    Completed: "#10B981",
    Rejected: "#EF4444",
    Cancelled: "#6B7280"
  };

  // Return color for the status
  // If status doesn't exist, use gray
  return colors[status] || "#6B7280";
};


export const getPriorityColor = (priority) => {

  const colors = {
    Low: "#10B981",
    Medium: "#3B82F6",
    High: "#F97316",
    Urgent: "#EF4444"
  };

  // Return color for the priority
  // If priority doesn't exist, use gray
  return colors[priority] || "#6B7280";
};


export const truncateText = (
  text,
  maxLength = 60
) => {

  // If there is no text
  if (!text) {
    return "";
  }

  // If text is longer than the limit,
  // cut it and add ...
  if (text.length > maxLength) {

    return (
      text.substring(0, maxLength) +
      "..."
    );

  }

  // Otherwise return the original text
  return text;
};
export const generateDataRoomAnalytics = (inputs) => {
  const kpis = [
    { title: "Documents Uploaded", value: "256" },
    { title: "Total Views", value: "1,482" },
    { title: "Total Downloads", value: "312" },
    { title: "Active Users", value: "12" },
  ];

  const engagementPlot = {
    data: [
      {
        x: ['Geological Maps', 'PSA Document', 'Production History', 'Reserves Report', 'Well Logs'],
        y: [320, 280, 250, 210, 180],
        type: 'bar',
        marker: { color: '#a3e635' }
      },
    ],
    layout: {
      title: 'Top 5 Most Viewed Documents',
      xaxis: { title: 'Document' },
      yaxis: { title: 'Views' },
    },
  };
  
  const activityLog = [
    { timestamp: "2025-06-27 14:05", user: "john.doe@buyer.com", action: "View", document: "Geological_Map_Horizon_A.pdf" },
    { timestamp: "2025-06-27 14:02", user: "john.doe@buyer.com", action: "Download", document: "Reserves_Report_P50.xlsx" },
    { timestamp: "2025-06-27 13:50", user: "jane.smith@buyer.com", action: "View", document: "Production_History_2020_2024.csv" },
    { timestamp: "2025-06-27 13:45", user: "internal.user@seller.com", action: "View", document: "Geological_Map_Horizon_A.pdf" },
    { timestamp: "2025-06-27 12:10", user: "john.doe@buyer.com", action: "View", document: "PSA_Main_Terms.docx" },
  ];

  const auditLog = [
     { timestamp: "2025-06-27 10:00", user: "admin@seller.com", action: "Create Data Room", details: `Name: ${inputs.dataRoomName}`},
     { timestamp: "2025-06-27 10:05", user: "admin@seller.com", action: "Upload Document", details: "Geological_Map_Horizon_A.pdf" },
     { timestamp: "2025-06-27 10:15", user: "admin@seller.com", action: "Add User", details: "john.doe@buyer.com granted read access" },
     { timestamp: "2025-06-27 11:30", user: "admin@seller.com", action: "Change Permission", details: "john.doe@buyer.com granted download access to 'Reservoir' folder" },
  ];

  return {
    kpis,
    engagementPlot,
    activityLog,
    auditLog,
  };
};
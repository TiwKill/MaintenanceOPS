export const generalSettings = {
    orgName: "Automotive Plant A",
    timezone: "UTC+7",
    currency: "USD",
    emailNotifications: true,
    autoApproveLowCost: 500,
};

export const integrations = [
    { name: "SAP ERP", status: "Connected", lastSync: "2h ago", type: "ERP" },
    { name: "Azure IoT Central", status: "Connected", lastSync: "15m ago", type: "IoT" },
    { name: "Slack", status: "Disconnected", lastSync: "Never", type: "Notification" },
    { name: "Zendesk", status: "Connected", lastSync: "1d ago", type: "Support" },
];

export const workflows = [
    { name: "High Cost Approval", trigger: "Stock Withdrawal > ,000", steps: 3, status: "Active" },
    { name: "Critical Machine Alert", trigger: "MAC Breakdown", steps: 2, status: "Active" },
    { name: "PM Generator", trigger: "Time Interval", steps: 1, status: "Active" },
];

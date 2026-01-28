export const audits = [
    { id: "AUD-001", user: "Admin", action: "Deleted User", target: "John Doe", timestamp: "2024-03-27 09:15:02" },
    { id: "AUD-002", user: "John Smith", action: "Modified Inventory", target: "INV-001", timestamp: "2024-03-27 10:30:14" },
    { id: "AUD-003", user: "Manager", action: "Approved WO", target: "WO-001", timestamp: "2024-03-27 11:45:55" },
];

export const permissions = [
    { role: "Maintenance Manager", description: "Full access to all modules, financial approvals.", userCount: 2 },
    { role: "Senior Technician", description: "Create WO, update inventory, close tickets.", userCount: 5 },
    { role: "Junior Technician", description: "View WO, update status, basic reporting.", userCount: 8 },
    { role: "Inventory Clerk", description: "Stock management and replenishment orders.", userCount: 3 },
];

export const compliance = [
    { id: "ISO-9001", name: "Quality Management", status: "Compliant", nextReview: "2024-12-15", score: 98 },
    { id: "OSHA-1910", name: "Occupational Safety", status: "Attention Required", nextReview: "2024-06-01", score: 82 },
    { id: "ISO-14001", name: "Environmental Management", status: "Compliant", nextReview: "2024-09-20", score: 95 },
];

export const workOrders = [
    { id: "WO-001", title: "Bearing Replacement", asset: "MAC-001", priority: "High", status: "In Progress", assignedTo: "John Smith", dueDate: "2024-03-28" },
    { id: "WO-002", title: "Conveyor Belt PM", asset: "MAC-004", priority: "Medium", status: "Scheduled", assignedTo: "Sarah Connor", dueDate: "2024-03-30" },
    { id: "WO-003", title: "Pump Calibration", asset: "MAC-003", priority: "Low", status: "Completed", assignedTo: "Mike Ross", dueDate: "2024-03-25" },
    { id: "WO-004", title: "Oil Leak Repair", asset: "MAC-002", priority: "High", status: "Open", assignedTo: "Unassigned", dueDate: "2024-03-29" },
];

export const breakdowns = [
    { id: "BD-001", machine: "MAC-005", startTime: "2024-03-25 08:30", endTime: "2024-03-25 14:20", duration: "5h 50m", cause: "Motor Failure" },
    { id: "BD-002", machine: "MAC-003", startTime: "2024-03-20 10:15", endTime: null, duration: "Running", cause: "Laser Alignment" },
    { id: "BD-003", machine: "MAC-001", startTime: "2024-03-18 16:45", endTime: "2024-03-18 17:30", duration: "45m", cause: "E-Stop Trigger" },
];

export const preventiveTasks = [
    { id: "PM-001", machine: "MAC-001", task: "Spindle Lubrication", frequency: "Weekly", nextDate: "2024-04-01", status: "Planned" },
    { id: "PM-002", machine: "MAC-002", task: "Filter Cleaning", frequency: "Monthly", nextDate: "2024-04-10", status: "Planned" },
    { id: "PM-003", machine: "MAC-004", task: "Belt Tension Check", frequency: "Bi-Weekly", nextDate: "2024-03-29", status: "Pending" },
];

export const machines = [
    { id: "MAC-001", name: "CNC Milling Center", model: "Precision-X 500", status: "Running", health: 92, lastService: "2024-03-15" },
    { id: "MAC-002", name: "Industrial 3D Printer", model: "MakerMax 3D", status: "Running", health: 85, lastService: "2024-03-10" },
    { id: "MAC-003", name: "Laser Cutter", model: "Photon-Z 100", status: "Maintenance", health: 45, lastService: "2024-03-20" },
    { id: "MAC-004", name: "Hydraulic Press", model: "ForceMaster 50T", status: "Running", health: 78, lastService: "2024-02-28" },
    { id: "MAC-005", name: "Injection Molder", model: "Plasti-Cast v2", status: "Breakdown", health: 12, lastService: "2024-01-15" },
];

export const inventory = [
    { id: "INV-001", name: "Ball Bearing 6205", category: "Mechanical", stock: 156, minStock: 50, price: 12.50 },
    { id: "INV-002", name: "Hydraulic Oil ISO 46", category: "Lubricants", stock: 240, minStock: 100, price: 45.00 },
    { id: "INV-003", name: "Proximity Sensor", category: "Electrical", stock: 12, minStock: 20, price: 85.00 },
    { id: "INV-004", name: "V-Belt A-42", category: "Mechanical", stock: 45, minStock: 30, price: 18.20 },
    { id: "INV-005", name: "Thermal Fuse 10A", category: "Electrical", stock: 120, minStock: 50, price: 2.10 },
];

export const tools = [
    { id: "TOOL-001", name: "Digital Multimeter", brand: "Fluke", condition: "Excellent", status: "Available", lastCalibrated: "2024-01-20" },
    { id: "TOOL-002", name: "Torque Wrench", brand: "Snap-on", condition: "Good", status: "In Use", lastCalibrated: "2024-02-15" },
    { id: "TOOL-003", name: "Infrared Thermometer", brand: "Testo", condition: "Fair", status: "Available", lastCalibrated: "2023-11-10" },
    { id: "TOOL-004", name: "Vibration Analyzer", brand: "SKF", condition: "Excellent", status: "In Use", lastCalibrated: "2024-03-01" },
];

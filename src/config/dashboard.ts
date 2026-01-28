import {
    Activity,
    ClipboardList,
    Cpu,
    Database,
    FileBarChart,
    Hammer,
    LayoutDashboard,
    Package,
    Settings2,
    ShieldCheck,
    Users,
    Factory,
    Boxes,
    CalendarCheck,
    FileText,
    History
} from "lucide-react"

export const dashboardConfig = {
    user: {
        name: "Admin User",
        email: "admin@maintenanceops.io",
        role: "Maintenance Manager",
        avatar: "/avatars/admin.jpg",
    },
    teams: [
        {
            name: "Automotive Plant A",
            logo: Factory,
            plan: "Enterprise",
        },
        {
            name: "Assembly Line B",
            logo: Cpu,
            plan: "Pro",
        },
        {
            name: "Warehouse North",
            logo: Boxes,
            plan: "Enterprise",
        },
    ],
    navMain: [
        {
            title: "Insights",
            url: "/dashboard",
            icon: LayoutDashboard,
            isActive: true,
            items: [
                {
                    title: "Overview",
                    url: "/dashboard",
                },
                {
                    title: "KPIs & Metrics",
                    url: "/dashboard/analytics/kpis",
                },
                {
                    title: "Asset Health",
                    url: "/dashboard/analytics/health",
                },
            ],
        },
        {
            title: "Operations",
            url: "/dashboard/operations",
            icon: ClipboardList,
            items: [
                {
                    title: "Work Orders",
                    url: "/dashboard/operations/work-orders",
                },
                {
                    title: "Breakdown Logs",
                    url: "/dashboard/operations/breakdowns",
                },
                {
                    title: "Preventive (PM)",
                    url: "/dashboard/operations/preventive",
                },
                {
                    title: "Schedules",
                    url: "/dashboard/operations/schedules",
                },
            ],
        },
        {
            title: "Asset Management",
            url: "/dashboard/assets",
            icon: Hammer,
            items: [
                {
                    title: "Machines",
                    url: "/dashboard/assets/machines",
                },
                {
                    title: "Spare Parts",
                    url: "/dashboard/assets/inventory",
                },
                {
                    title: "Tools & Equipment",
                    url: "/dashboard/assets/tools",
                },
            ],
        },
        {
            title: "Governance",
            url: "/dashboard/governance",
            icon: ShieldCheck,
            items: [
                {
                    title: "Audit Logs",
                    url: "/dashboard/governance/audits",
                },
                {
                    title: "User Permissions",
                    url: "/dashboard/governance/permissions",
                },
                {
                    title: "Compliance",
                    url: "/dashboard/governance/compliance",
                },
            ],
        },
        {
            title: "Settings",
            url: "/dashboard/settings",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "/dashboard/settings/general",
                },
                {
                    title: "Integrations",
                    url: "/dashboard/settings/integrations",
                },
                {
                    title: "Workflows",
                    url: "/dashboard/settings/workflows",
                },
            ],
        },
    ],
    projects: [
        {
            name: "Line 1 - Performance Audit",
            url: "/dashboard/projects/line-1",
            icon: Activity,
        },
        {
            name: "Quarterly PM Strategy",
            url: "/dashboard/projects/pm-strategy",
            icon: FileText,
        },
        {
            name: "Stock Optimization",
            url: "/dashboard/projects/stock-opt",
            icon: Package,
        },
    ],
}

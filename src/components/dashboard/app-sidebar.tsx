"use client"

import * as React from "react"
import { NavMain } from "@/components/dashboard/nav-main"
import { NavProjects } from "@/components/dashboard/nav-projects"
import { NavUser } from "@/components/dashboard/nav-user"
import { TeamSwitcher } from "@/components/dashboard/team-switcher"
import { authService } from "@/services/api"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import { dashboardConfig } from "@/config/dashboard"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [user, setUser] = React.useState(dashboardConfig.user);

    React.useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await authService.getMe();
                if (userData) {
                    setUser({
                        name: `${userData.first_name} ${userData.last_name}`,
                        email: userData.email,
                        role: userData.role,
                        avatar: userData.avatar_url || "/avatars/default.jpg", 
                    });
                }
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
            }
        };
        fetchUser();
    }, []);

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={dashboardConfig.teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={dashboardConfig.navMain} />
                <NavProjects projects={dashboardConfig.projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

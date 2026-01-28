"use client"

import * as React from "react"
import {
    Folder,
    Forward,
    MoreHorizontal,
    Trash2,
    type LucideIcon,
    ChevronDown,
    ChevronUp
} from "lucide-react"
import Link from "next/link"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"

export function NavProjects({
    projects,
}: {
    projects: {
        name: string
        url: string
        icon: LucideIcon
    }[]
}) {
    const { isMobile } = useSidebar()
    const [isExpanded, setIsExpanded] = React.useState(false)

    // Load expanded state from localStorage
    React.useEffect(() => {
        const saved = localStorage.getItem("nav-projects-expanded")
        if (saved === "true") {
            setIsExpanded(true)
        }
    }, [])

    const toggleExpand = () => {
        const newState = !isExpanded
        setIsExpanded(newState)
        localStorage.setItem("nav-projects-expanded", String(newState))
    }

    const INITIAL_VISIBLE_COUNT = 2
    const visibleProjects = isExpanded ? projects : projects.slice(0, INITIAL_VISIBLE_COUNT)
    const hasMore = projects.length > INITIAL_VISIBLE_COUNT

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarMenu>
                {visibleProjects.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild>
                            <Link href={item.url}>
                                <item.icon />
                                <span>{item.name}</span>
                            </Link>
                        </SidebarMenuButton>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuAction showOnHover>
                                    <MoreHorizontal />
                                    <span className="sr-only">More</span>
                                </SidebarMenuAction>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-48 rounded-lg"
                                side={isMobile ? "bottom" : "right"}
                                align={isMobile ? "end" : "start"}
                            >
                                <DropdownMenuItem>
                                    <Folder className="text-muted-foreground" />
                                    <span>View Project</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Forward className="text-muted-foreground" />
                                    <span>Share Project</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Trash2 className="text-muted-foreground" />
                                    <span>Delete Project</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                ))}
                
                {hasMore && (
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            className="text-sidebar-foreground/70 hover:text-sidebar-foreground" 
                            onClick={toggleExpand}
                        >
                            {isExpanded ? (
                                <>
                                    <ChevronUp className="text-sidebar-foreground/70" />
                                    <span>Show Less</span>
                                </>
                            ) : (
                                <>
                                    <MoreHorizontal className="text-sidebar-foreground/70" />
                                    <span>More ({projects.length - INITIAL_VISIBLE_COUNT} additional)</span>
                                </>
                            )}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                )}
            </SidebarMenu>
        </SidebarGroup>
    )
}

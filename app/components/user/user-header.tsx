"use client";

import Link from "next/link";
import { Bell, Search, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const notifications = [
  {
    id: 1,
    title: "Nouvel article disponible",
    description: "Un nouvel article dans vos favoris",
    time: "Il y a 5 min",
    unread: true,
  },
  {
    id: 2,
    title: "Fin de votre essai gratuit",
    description: "Votre essai gratuit prend fin dans 3 jours",
    time: "Il y a 1h",
    unread: true,
  },
  {
    id: 3,
    title: "Newsletter publiée",
    description: "La dernière newsletter est disponible",
    time: "Il y a 3h",
    unread: false,
  },
];

export function UserHeader() {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-6" />

      <div className="flex flex-1 items-center gap-4">
        <form className="hidden md:flex flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher des articles..."
              className="w-full pl-9 h-9 bg-muted/50 border-0 focus-visible:bg-background"
            />
          </div>
        </form>
      </div>

      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="sm" className="hidden sm:flex gap-1.5">
          <Link href="/" target="_blank">
            <ExternalLink className="h-3.5 w-3.5" />
            Voir le site
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
                >
                  {unreadCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} nouvelles
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start gap-1 p-3 cursor-pointer"
              >
                <div className="flex items-center gap-2 w-full">
                  {notification.unread && (
                    <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                  )}
                  <span className="font-medium text-sm">{notification.title}</span>
                </div>
                <p className="text-xs text-muted-foreground pl-4">{notification.description}</p>
                <span className="text-[10px] text-muted-foreground pl-4">{notification.time}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary text-sm cursor-pointer">
              Voir toutes les notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

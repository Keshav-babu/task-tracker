"use client"

import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"

import type { RootState } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BugIcon, PlusCircle, User } from "lucide-react"
import { logout } from "@/lib/auth/authSlice"

interface HeaderProps {
  onCreateTask: () => void
}

export default function Header({ onCreateTask }: HeaderProps) {
  const dispatch = useDispatch()
  const router = useRouter()
  const { user } = useSelector((state: RootState) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    router.push("/")
  }

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BugIcon className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Bug Tracker</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onCreateTask}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Task
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user?.username}</span>
                  <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}


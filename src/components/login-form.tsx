"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch } from "react-redux"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BugIcon } from "lucide-react"
import { login } from "@/lib/auth/authSlice"

export default function LoginForm() {
  const dispatch = useDispatch()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("developer")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Simple validation
    if (!username || !password) {
      setError("Username and password are required")
      return
    }

    // Mock authentication - in a real app, this would call an API
    if (username === "user" && password === "password") {
      dispatch(login({ username, role }))
    } else {
      setError("Invalid credentials. Try user/password")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-2">
          <BugIcon className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl text-center">Bug Tracker</CardTitle>
        <CardDescription className="text-center">Enter your credentials to sign in to your account</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {error && <div className="p-3 text-sm bg-destructive/15 text-destructive rounded-md">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full mt-2">
              Sign In
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-xs text-muted-foreground text-center mt-2">
          For demo: Use username &quot;user&quot; and password &quot;password&quot;
        </p>
      </CardFooter>
    </Card>
  )
}


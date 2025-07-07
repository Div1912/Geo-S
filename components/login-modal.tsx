"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Satellite, Mail, Lock, User, Phone, Building, AlertCircle, CheckCircle, Loader2, Zap } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function LoginModal() {
  const { login, register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState("login")
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    organization: "",
    phone: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      await login(loginData.email, loginData.password)
      setSuccess("Login successful! Redirecting...")
      // The useAuth hook will handle the state change and redirect
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      await register(signupData)
      setSuccess("Account created successfully! Welcome to GeoSentinel!")
      // The useAuth hook will handle the state change and redirect
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Demo login function
  const handleDemoLogin = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("Logging in with demo credentials...")

    try {
      // Use the actual login function for consistency
      await login("demo@geosentinel.com", "demo123")
    } catch (err: any) {
      setError("Demo login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-lg mx-auto mb-4">
            <Satellite className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-white">Welcome to GeoSentinel</CardTitle>
          <CardDescription className="text-slate-400">AI-Powered Glacial Monitoring System</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 border-red-500 bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-green-500 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-400">{success}</AlertDescription>
            </Alert>
          )}

          {/* Demo Login Button */}
          <div className="mb-4">
            <Button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Try Demo Login
                </>
              )}
            </Button>
            <p className="text-xs text-slate-400 text-center mt-2">Quick access with demo credentials</p>
          </div>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-800 px-2 text-slate-400">Or continue with</span>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
                <div className="text-center">
                  <Button variant="link" className="text-blue-400">
                    Forgot password?
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-slate-300">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization" className="text-slate-300">
                    Organization
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="organization"
                      placeholder="ISRO, NDMA, University, etc."
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                      value={signupData.organization}
                      onChange={(e) => setSignupData({ ...signupData, organization: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-300">
                    Phone
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="phone"
                      placeholder="Enter your phone number"
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                      value={signupData.phone}
                      onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-slate-300">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

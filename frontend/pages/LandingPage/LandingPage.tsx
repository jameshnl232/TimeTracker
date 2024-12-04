import { Button } from "@/components/ui/button";
import { Clock, BarChart3, Calendar } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-gray-800">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-6 w-6" />
            <span className="text-xl font-bold">TimeTrack Pro</span>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
            Track Your Time, Boost Your Productivity
          </h1>
          <p className="mb-8 text-xl text-gray-200">
            Effortlessly manage your work hours, track projects, and handle
            time-off requests all in one place.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/login">Start Tracking Now</Link>
            </Button>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="bg-card rounded-lg p-6 shadow-lg">
            <Clock className="text-primary mb-4 h-12 w-12" />
            <h3 className="mb-2 text-xl font-semibold">Time Tracking</h3>
            <p className="text-muted-foreground">
              Simple one-click timer to track your work hours accurately.
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 shadow-lg">
            <BarChart3 className="text-primary mb-4 h-12 w-12" />
            <h3 className="mb-2 text-xl font-semibold">Analytics Dashboard</h3>
            <p className="text-muted-foreground">
              Comprehensive insights into your work patterns and productivity.
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 shadow-lg">
            <Calendar className="text-primary mb-4 h-12 w-12" />
            <h3 className="mb-2 text-xl font-semibold">Leave Management</h3>
            <p className="text-muted-foreground">
              Easy vacation and absence request system with approval workflow.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

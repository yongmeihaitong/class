import Link from "next/link"
import { BookOpen, BarChart2, Users, Settings } from "lucide-react"

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-2xl font-bold">Instructor Dashboard</h2>
        </div>
        <nav className="mt-6">
          <Link href="/instructor" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
            <BookOpen className="inline-block w-5 h-5 mr-2" />
            Courses
          </Link>
          <Link href="/instructor/analytics" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
            <BarChart2 className="inline-block w-5 h-5 mr-2" />
            Analytics
          </Link>
          <Link href="/instructor/students" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
            <Users className="inline-block w-5 h-5 mr-2" />
            Students
          </Link>
          <Link href="/instructor/settings" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
            <Settings className="inline-block w-5 h-5 mr-2" />
            Settings
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  )
}


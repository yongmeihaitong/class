import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const courses = [
  {
    id: "1",
    title: "Investment Banking Fundamentals",
    students: 1542,
    revenue: 306958,
    lastUpdated: "2023-05-15",
  },
  {
    id: "2",
    title: "Stock Trading Strategies",
    students: 2103,
    revenue: 209997,
    lastUpdated: "2023-06-02",
  },
  {
    id: "3",
    title: "Personal Finance Mastery",
    students: 3184,
    revenue: 315216,
    lastUpdated: "2023-05-28",
  },
]

export default function InstructorDashboard() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Courses</h1>
        <Button asChild>
          <Link href="/instructor/create-course">Create New Course</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course Title</TableHead>
            <TableHead>Students</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell>{course.title}</TableCell>
              <TableCell>{course.students}</TableCell>
              <TableCell>${course.revenue.toLocaleString()}</TableCell>
              <TableCell>{course.lastUpdated}</TableCell>
              <TableCell>
                <Button variant="outline" asChild className="mr-2">
                  <Link href={`/instructor/courses/${course.id}`}>Edit</Link>
                </Button>
                <Button variant="outline">View Analytics</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}


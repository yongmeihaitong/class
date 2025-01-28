import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const students = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", enrolledCourses: 2, lastActive: "2023-06-10" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", enrolledCourses: 1, lastActive: "2023-06-09" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com", enrolledCourses: 3, lastActive: "2023-06-11" },
]

export default function StudentsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Students</h1>
      <div className="flex justify-between items-center mb-4">
        <Input placeholder="Search students..." className="max-w-sm" />
        <Button>Export CSV</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Enrolled Courses</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.enrolledCourses}</TableCell>
              <TableCell>{student.lastActive}</TableCell>
              <TableCell>
                <Button variant="outline">View Details</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}


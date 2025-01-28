import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardSummaryProps {
  totalCourses: number
  averageProgress: number
  completedCourses: number
}

export function DashboardSummary({ totalCourses, averageProgress, completedCourses }: DashboardSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Courses Enrolled</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCourses}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageProgress.toFixed(1)}%</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedCourses}</div>
        </CardContent>
      </Card>
    </div>
  )
}


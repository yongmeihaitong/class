import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ActivityType } from "@prisma/client"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface Activity {
  id: string
  activityType: ActivityType
  createdAt: string
  course: {
    title: string
    slug: string
  }
  lesson: {
    title: string
  }
}

interface RecentActivityProps {
  activities: Activity[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityMessage = (activity: Activity) => {
    switch (activity.activityType) {
      case "LESSON_STARTED":
        return `Started lesson "${activity.lesson.title}" in "${activity.course.title}"`
      case "LESSON_COMPLETED":
        return `Completed lesson "${activity.lesson.title}" in "${activity.course.title}"`
      case "QUIZ_ATTEMPTED":
        return `Attempted quiz in "${activity.lesson.title}" (${activity.course.title})`
      case "QUIZ_COMPLETED":
        return `Completed quiz in "${activity.lesson.title}" (${activity.course.title})`
      default:
        return `Interacted with "${activity.course.title}"`
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li key={activity.id} className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium">{getActivityMessage(activity)}</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </p>
              </div>
              <Link href={`/courses/${activity.course.slug}/content`} className="text-xs text-blue-500 hover:underline">
                Go to course
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}


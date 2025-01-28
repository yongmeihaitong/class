import { notFound, redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { getUserFromToken } from "@/lib/auth"
import { SiteHeader } from "@/components/site-header"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { VideoLesson } from "@/components/VideoLesson"
import { TextLesson } from "@/components/TextLesson"
import { QuizLesson } from "@/components/QuizLesson"
import { Progress } from "@/components/ui/progress"

const prisma = new PrismaClient()

interface CourseContentPageProps {
  params: {
    category: string
    slug: string
  }
}

async function checkCourseAccess(courseId: string, userId: string) {
  const access = await prisma.courseAccess.findUnique({
    where: {
      userId_courseId: {
        userId: userId,
        courseId: courseId,
      },
    },
  })
  return !!access
}

export default async function CourseContentPage({ params }: CourseContentPageProps) {
  const user = await getUserFromToken()
  if (!user) {
    redirect("/auth/login")
  }

  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
    include: {
      chapters: {
        include: {
          lessons: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  })

  if (!course) {
    notFound()
  }

  const hasAccess = await checkCourseAccess(course.id, user.userId)

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 container py-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Courses", href: `/courses/${params.category}` },
              { label: course.title, href: `/courses/${params.category}/${params.slug}` },
              { label: "Content", href: `/courses/${params.category}/${params.slug}/content` },
            ]}
          />
          <div className="mt-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>
                You do not have access to this course content. Please purchase the course to gain access.
              </AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button asChild>
                <a href={`/courses/${params.category}/${params.slug}`}>Go to Course Page</a>
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const progress = await prisma.courseProgress.findUnique({
    where: {
      userId_courseId: {
        userId: user.userId,
        courseId: course.id,
      },
    },
    include: {
      lessonProgress: true,
    },
  })

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Courses", href: `/courses/${params.category}` },
            { label: course.title, href: `/courses/${params.category}/${params.slug}` },
            { label: "Content", href: `/courses/${params.category}/${params.slug}/content` },
          ]}
        />
        <h1 className="text-3xl font-bold mt-8 mb-4">{course.title} - Course Content</h1>
        <Progress value={progress?.progress || 0} className="w-full mb-8" />
        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-1 bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Chapters</h2>
            <ul className="space-y-2">
              {course.chapters.map((chapter) => (
                <li key={chapter.id}>
                  <h3 className="font-medium">{chapter.title}</h3>
                  <ul className="ml-4 mt-2 space-y-1">
                    {chapter.lessons.map((lesson) => (
                      <li key={lesson.id} className="text-sm text-gray-600 flex items-center">
                        <span
                          className={`mr-2 ${
                            progress?.lessonProgress.find((lp) => lp.lessonId === lesson.id)?.completed
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                        >
                          {progress?.lessonProgress.find((lp) => lp.lessonId === lesson.id)?.completed ? "✓" : "○"}
                        </span>
                        {lesson.title}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-3">
            {course.chapters.map((chapter) => (
              <div key={chapter.id} className="mb-8">
                <h2 className="text-2xl font-bold mb-4">{chapter.title}</h2>
                {chapter.lessons.map((lesson) => (
                  <div key={lesson.id} className="mb-6">
                    {lesson.type === "VIDEO" && (
                      <VideoLesson
                        title={lesson.title}
                        videoUrl={lesson.content}
                        courseId={course.id}
                        id={lesson.id}
                        course={course}
                      />
                    )}
                    {lesson.type === "TEXT" && (
                      <TextLesson
                        title={lesson.title}
                        content={JSON.parse(lesson.content)}
                        completed={progress?.lessonProgress.find((lp) => lp.lessonId === lesson.id)?.completed || false}
                        setCompleted={(completed) => {
                          // Update lesson progress
                        }}
                      />
                    )}
                    {lesson.type === "QUIZ" && (
                      <QuizLesson title={lesson.title} questions={JSON.parse(lesson.content)} />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}


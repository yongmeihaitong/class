import { PortableText } from "@portabletext/react"

interface TextLessonProps {
  title: string
  content: any[] // Assuming we're using a rich text format like Portable Text
  completed: boolean
  setCompleted: (completed: boolean) => void
}

export function TextLesson({ title, content, completed, setCompleted }: TextLessonProps) {
  const handleCompletion = () => {
    setCompleted(true)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="prose max-w-none">
        <PortableText value={content} />
      </div>
      <button
        onClick={handleCompletion}
        disabled={completed}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Mark as Complete
      </button>
    </div>
  )
}


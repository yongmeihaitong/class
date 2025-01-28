"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: string
}

interface QuizLessonProps {
  title: string
  questions: Question[]
}

export function QuizLesson({ title, questions }: QuizLessonProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(new Array(questions.length).fill(""))
  const [showResults, setShowResults] = useState(false)

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answer
    setSelectedAnswers(newAnswers)
  }

  const updateProgress = async () => {
    //Implementation to update progress
    console.log("Quiz completed. Update progress here.")
  }

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
      await updateProgress()
    }
  }

  const calculateScore = () => {
    return questions.reduce((score, question, index) => {
      return score + (selectedAnswers[index] === question.correctAnswer ? 1 : 0)
    }, 0)
  }

  if (showResults) {
    const score = calculateScore()
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{title} - Results</h2>
        <p className="text-xl">
          Your score: {score} out of {questions.length}
        </p>
        <Button
          onClick={() => {
            setCurrentQuestion(0)
            setSelectedAnswers(new Array(questions.length).fill(""))
            setShowResults(false)
          }}
        >
          Retake Quiz
        </Button>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-lg">
        Question {currentQuestion + 1} of {questions.length}
      </p>
      <p className="text-xl">{question.text}</p>
      <RadioGroup value={selectedAnswers[currentQuestion]} onValueChange={handleAnswerSelect}>
        {question.options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={`option-${index}`} />
            <Label htmlFor={`option-${index}`}>{option}</Label>
          </div>
        ))}
      </RadioGroup>
      <Button onClick={handleNext} disabled={!selectedAnswers[currentQuestion]}>
        {currentQuestion < questions.length - 1 ? "Next" : "Finish"}
      </Button>
    </div>
  )
}


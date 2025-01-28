import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const course = await prisma.course.findUnique({
    where: { slug: "investment-banking-fundamentals" },
  })

  if (!course) {
    console.log("Course not found")
    return
  }

  const chapter1 = await prisma.chapter.create({
    data: {
      title: "Introduction to Investment Banking",
      order: 1,
      courseId: course.id,
      lessons: {
        create: [
          {
            title: "What is Investment Banking?",
            order: 1,
            type: "VIDEO",
            content: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual video URL
          },
          {
            title: "Key Concepts in Investment Banking",
            order: 2,
            type: "TEXT",
            content: JSON.stringify([
              {
                _type: "block",
                children: [
                  {
                    _type: "span",
                    text: "Investment banking is a specialized division of banking that deals with creating capital for companies, governments, and other entities. Key concepts include:",
                  },
                ],
              },
              {
                _type: "block",
                children: [
                  { _type: "span", text: "1. Underwriting" },
                  { _type: "span", text: "2. Mergers and Acquisitions" },
                  { _type: "span", text: "3. Asset Management" },
                  { _type: "span", text: "4. Financial Advisory" },
                ],
                level: 1,
                listItem: "bullet",
              },
            ]),
          },
          {
            title: "Quiz: Investment Banking Basics",
            order: 3,
            type: "QUIZ",
            content: JSON.stringify([
              {
                id: "1",
                text: "What is the primary role of investment banks?",
                options: [
                  "Provide personal loans",
                  "Create capital for entities",
                  "Manage retail banking operations",
                  "Regulate financial markets",
                ],
                correctAnswer: "Create capital for entities",
              },
              {
                id: "2",
                text: "Which of the following is NOT a key concept in investment banking?",
                options: ["Underwriting", "Mergers and Acquisitions", "Mortgage Lending", "Financial Advisory"],
                correctAnswer: "Mortgage Lending",
              },
            ]),
          },
        ],
      },
    },
  })

  console.log("Sample course content created")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


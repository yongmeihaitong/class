import type React from "react"
import { render } from "mjml-react"
import {
  Mjml,
  MjmlHead,
  MjmlTitle,
  MjmlPreview,
  MjmlBody,
  MjmlSection,
  MjmlColumn,
  MjmlText,
  MjmlImage,
  MjmlButton,
  MjmlAttributes,
  MjmlAll,
  MjmlStyle,
} from "mjml-react"

interface EmailTemplateProps {
  title: string
  previewText: string
  content: React.ReactNode
}

const BaseTemplate: React.FC<EmailTemplateProps> = ({ title, previewText, content }) => {
  return (
    <Mjml>
      <MjmlHead>
        <MjmlTitle>{title}</MjmlTitle>
        <MjmlPreview>{previewText}</MjmlPreview>
        <MjmlAttributes>
          <MjmlAll fontFamily="Arial, sans-serif" />
        </MjmlAttributes>
        <MjmlStyle>{`
          .body-section {
            background-color: #ffffff;
          }
          .text-primary {
            color: #000000;
          }
          .footer {
            background-color: #f0f0f0;
          }
        `}</MjmlStyle>
      </MjmlHead>
      <MjmlBody backgroundColor="#f0f0f0">
        <MjmlSection paddingBottom="20px" paddingTop="20px">
          <MjmlColumn>
            <MjmlImage width="100px" src={`${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`} alt="LearnHub Logo" />
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection cssClass="body-section">
          <MjmlColumn>{content}</MjmlColumn>
        </MjmlSection>
        <MjmlSection cssClass="footer" paddingTop="20px" paddingBottom="20px">
          <MjmlColumn>
            <MjmlText align="center" fontSize="12px" color="#6c757d">
              &copy; 2023 LearnHub. All rights reserved.
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
      </MjmlBody>
    </Mjml>
  )
}

export const VerificationEmailTemplate: React.FC<{ name: string; verificationLink: string }> = ({
  name,
  verificationLink,
}) => {
  const { html } = render(
    <BaseTemplate
      title="Verify Your Email Address"
      previewText="Welcome to LearnHub! Please verify your email address to get started."
      content={
        <>
          <MjmlText fontSize="20px" color="#000000" fontWeight="bold">
            Welcome to LearnHub!
          </MjmlText>
          <MjmlText fontSize="16px" color="#000000">
            Hi {name},
          </MjmlText>
          <MjmlText fontSize="16px" color="#000000">
            Thank you for signing up. To get started, please verify your email address by clicking the button below:
          </MjmlText>
          <MjmlButton backgroundColor="#007bff" color="#ffffff" href={verificationLink}>
            Verify Email Address
          </MjmlButton>
          <MjmlText fontSize="16px" color="#000000">
            If you didn't create an account, you can safely ignore this email.
          </MjmlText>
        </>
      }
    />,
  )
  return { html }
}

export const WelcomeEmailTemplate: React.FC<{ name: string }> = ({ name }) => {
  const { html } = render(
    <BaseTemplate
      title="Welcome to LearnHub"
      previewText="Your account has been verified. Start exploring our courses!"
      content={
        <>
          <MjmlText fontSize="20px" color="#000000" fontWeight="bold">
            Welcome to LearnHub!
          </MjmlText>
          <MjmlText fontSize="16px" color="#000000">
            Hi {name},
          </MjmlText>
          <MjmlText fontSize="16px" color="#000000">
            Your account has been successfully verified. We're excited to have you on board!
          </MjmlText>
          <MjmlText fontSize="16px" color="#000000">
            Start exploring our wide range of courses and begin your learning journey today.
          </MjmlText>
          <MjmlButton backgroundColor="#007bff" color="#ffffff" href={`${process.env.NEXT_PUBLIC_BASE_URL}/courses`}>
            Explore Courses
          </MjmlButton>
        </>
      }
    />,
  )
  return { html }
}


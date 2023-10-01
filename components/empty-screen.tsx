import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

const exampleMessages = [
  {
    heading: 'Summarize a Legal Document',
    message: `Summarize this legal document:`
  },
  {
    heading: 'Draft a Legal Document',
    message: 'Task: Draft a professional legal document like contracts, wills, legal notices, court documents, etc. specified in the user input, delimited by triple backticks.\n' +
      '\n' +
      'Input:\n' +
      'The type of legal document (e.g., contract, will, legal notice, court document, etc.)\n' +
      'A description of the legal document, including the following information:\n' +
      'The names and addresses of the parties involved\n' +
      'The key terms and conditions of the document\n' +
      'Any other relevant details\n' +
      '\n' +
      'Output:\n' +
      'A professional legal document that adheres to the guidelines specified by Indian law and is legally viable in the Indian court of law.\n' +
      '\n' +
      'Additional guidelines for legal documents:\n' +
      'The language used in the document must be clear, concise, and easy to understand for all parties involved.\n' +
      'The document must be comprehensive and cover all of the relevant terms and conditions.\n' +
      'The document must be drafted in compliance with all applicable Indian laws and regulations.\n' +
      'The document must adhere to the guidelines specified by Indian law.\n' +
      '\n' +
      'For the above instructions, determine if anything needs to be clarified. \n' +
      '\n' +
      'If yes, do not carry them out. You can make reasonable assumptions, but if you are unsure, ask questions in short for clarification. If there are multiple questions, ask them one by one. If you still need more information, keep asking again until you have all the required information. DO NOT OUTPUT PLACEHOLDER TEXT IN THE OUTPUT DOCUMENT.\n' +
      '\n' +
      'If nothing else needs to be clarified, output the document. \n'+
      '```\n' +
      '\n' +
      '```\n'
  },
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          Welcome to paralegal.ai!
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          This is a prototype AI chatbot for creating and interpreting legal documents.
        </p>
        <p className="leading-normal text-muted-foreground">
          You can start a conversation here or try the following examples:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

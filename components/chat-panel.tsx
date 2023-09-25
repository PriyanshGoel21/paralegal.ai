import { type UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconRefresh, IconStop } from '@/components/ui/icons'
import { FooterText } from '@/components/footer'

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | 'append'
    | 'isLoading'
    | 'reload'
    | 'messages'
    | 'stop'
    | 'input'
    | 'setInput'
  > {
  id?: string
}

export function ChatPanel({
  id,
  isLoading,
  stop,
  append,
  reload,
  input,
  setInput,
  messages
}: ChatPanelProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex h-10 items-center justify-center">
          {isLoading ? (
            <Button
              variant="outline"
              onClick={() => stop()}
              className="bg-background"
            >
              <IconStop className="mr-2" />
              Stop generating
            </Button>
          ) : (
            messages?.length > 0 && (
              <Button
                variant="outline"
                onClick={() => reload()}
                className="bg-background"
              >
                <IconRefresh className="mr-2" />
                Regenerate response
              </Button>
            )
          )}
        </div>
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm
            onSubmit={async value => {
              if (value.toLowerCase().includes("generate") || value.toLowerCase().includes("draft")){
                value = "Task: Draft a professional legal document like contracts, wills, legal notices, court documents, etc. specified in the user input, delimited by triple backticks.\n" +
                    "\n" +
                    "Input:\n" +
                    "The type of legal document (e.g., contract, will, legal notice, court document, etc.)\n" +
                    "A description of the legal document, including the following information:\n" +
                    "The names and addresses of the parties involved\n" +
                    "The key terms and conditions of the document\n" +
                    "Any other relevant details\n" +
                    "\n" +
                    "Output:\n" +
                    "A professional legal document that adheres to the guidelines specified by Indian law and is legally viable in the Indian court of law.\n" +
                    "\n" +
                    "Additional guidelines for legal documents:\n" +
                    "The language used in the document must be clear and concise, and easy to understand for all parties involved.\n" +
                    "The document must be comprehensive and cover all of the relevant terms and conditions.\n" +
                    "The document must be drafted in compliance with all applicable Indian laws and regulations.\n" +
                    "The document must adhere to the guidelines specified by Indian law..\n" + value
              }

              await append({
                id,
                content: value,
                role: 'user'
              })
            }}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
          />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  )
}

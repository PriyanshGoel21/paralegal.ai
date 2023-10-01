import { UseChatHelpers } from 'ai/react'
import * as React from 'react'
import Textarea from 'react-textarea-autosize'

import { Button, buttonVariants } from '@/components/ui/button'
import { IconArrowElbow, IconPlus } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import {useRef} from "react";

export interface PromptProps
  extends Pick<UseChatHelpers, 'input' | 'setInput'> {
  onSubmit: (value: string) => Promise<void>
  isLoading: boolean
}

export function PromptForm({
  onSubmit,
  input,
  setInput,
  isLoading
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  const inputFileRef= useRef(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleAddFile=(event: React.MouseEvent<unknown>)=>{
    // @ts-ignore
    inputFileRef.current.click();
  }

  return (
    <form
      onSubmit={async e => {
        e.preventDefault()
        if (!input?.trim()) {
          return
        }
        setInput('')
        await onSubmit(`Task: Draft a professional legal document like contracts, wills, legal notices, court documents, etc. specified in the user input, delimited by triple backticks.

Input:
The type of legal document (e.g., contract, will, legal notice, court document, etc.)
A description of the legal document, including the following information:
The names and addresses of the parties involved
The key terms and conditions of the document
Any other relevant details

Output:
A professional legal document that adheres to the guidelines specified by Indian law and is legally viable in the Indian court of law.

Additional guidelines for legal documents:
The language used in the document must be clear, concise, and easy to understand for all parties involved.
The document must be comprehensive and cover all of the relevant terms and conditions.
The document must be drafted in compliance with all applicable Indian laws and regulations.
The document must adhere to the guidelines specified by Indian law.

\`\`\`
Create a contract between Lala Arnav Vatsal and Priyansh Goel. It should state that Priyansh would give Arnav 1 lakh rupees if they win the smart India hackathon.
\`\`\`

For the above instructions, determine if anything needs to be clarified. 

If yes, do not carry them out. You can make reasonable assumptions, but if you are unsure, ask questions in short for clarification. If there are multiple questions, ask them one by one. If you still need more information, keep asking again until you have all the required information. DO NOT OUTPUT PLACEHOLDER TEXT IN THE OUTPUT DOCUMENT.

If nothing else needs to be clarified, output the document.${input}`)
      }}
      ref={formRef}
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={e => {
                e.preventDefault()
                router.refresh()
                router.push('/')
              }}
              className={cn(
                buttonVariants({ size: 'sm', variant: 'outline' }),
                'absolute left-0 top-4 h-8 w-8 rounded-full bg-background p-0 sm:left-4'
              )}
            >
              <IconPlus onClick={(event)=>handleAddFile(event)} />
              <span className="sr-only">New Chat</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Send a message."
          spellCheck={false}
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
        />
        <div className="absolute right-0 top-4 sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || input === ''}
              >
                <IconArrowElbow />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  )
}

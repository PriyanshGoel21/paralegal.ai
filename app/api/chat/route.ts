import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'

export const runtime = 'edge'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
  const json = await req.json()
  const { messages, previewToken } = json
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  if (previewToken) {
    configuration.apiKey = previewToken
  }

  console.log(messages)

  const  message = messages.pop()
  if (message.includes("generate") || message.includes("draft")){
    messages.push("Task: Draft a professional legal document like contracts, wills, legal notices, court documents, etc. specified in the user input, delimited by triple backticks.\n" +
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
        "The document must adhere to the guidelines specified by Indian law.\n" + message)
  }
  else{
    messages.push(message)
  }

  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.7,
    stream: true
  })

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      const title = json.messages[0].content.substring(0, 100)
      const id = json.id ?? nanoid()
      const createdAt = Date.now()
      const path = `/chat/${id}`
      const payload = {
        id,
        title,
        userId,
        createdAt,
        path,
        messages: [
          ...messages,
          {
            content: completion,
            role: 'assistant'
          }
        ]
      }
      await kv.hmset(`chat:${id}`, payload)
      await kv.zadd(`user:chat:${userId}`, {
        score: createdAt,
        member: `chat:${id}`
      })
    }
  })

  return new StreamingTextResponse(stream)
}

import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Chatbot is not configured. Please contact the administrator.' },
        { status: 500 }
      )
    }

    // Fetch chatbot knowledge base from Supabase
    const supabase = await createClient()
    const { data: knowledge } = await supabase
      .from('chatbot_knowledge')
      .select('question, answer, category')
      .eq('is_active', true)

    // Build context from knowledge base
    let context = 'Here is information about Changaramkulam U P School:\n\n'

    if (knowledge && knowledge.length > 0) {
      const groupedByCategory: Record<string, typeof knowledge> = {}

      knowledge.forEach((item) => {
        const category = item.category || 'General'
        if (!groupedByCategory[category]) {
          groupedByCategory[category] = []
        }
        groupedByCategory[category].push(item)
      })

      Object.entries(groupedByCategory).forEach(([category, items]) => {
        context += `\n${category.toUpperCase()}:\n`
        items.forEach((item) => {
          context += `Q: ${item.question}\nA: ${item.answer}\n\n`
        })
      })
    } else {
      context += 'Contact information and basic details about the school are available on the Contact page.\n'
    }

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Free tier friendly, cheap and fast
      max_tokens: 500,
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant for Changaramkulam U P School in Kerala, India.

Your role:
- Answer questions about the school based on the knowledge base provided
- Be friendly, professional, and concise
- If you don't know the answer, politely say so and suggest contacting the school directly
- Provide contact information when relevant
- Use simple, clear language suitable for parents and students

Knowledge Base:
${context}

Guidelines:
- Keep responses under 150 words
- Be warm and welcoming
- If asked about admissions, fees, or specific dates not in the knowledge base, direct them to contact the school
- Never make up information - only use what's provided in the knowledge base`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
    })

    const reply = response.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error('Chatbot error:', error)

    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key. Please contact the administrator.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    )
  }
}

export const SUGGESTIONS = [
  "What is the weather in San Francisco?",
  "Explain step-by-step how to solve this math problem: If x² + 6x + 9 = 25, what is x?",
  "Design a simple algorithm to find the longest palindrome in a string.",
]

export const MODELS = ["Llama 3.3 70B", "GPT-4o", "Claude 3.5 Sonnet", "Gemini 2.0 Flash"]

export function simulateReply(content: string, model: string): string {
  return `You asked: "${content}"\n\nThis is a simulated response from **${model}**. Connect your backend to get real AI-powered answers.`
}

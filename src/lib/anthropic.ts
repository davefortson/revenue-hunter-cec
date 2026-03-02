import Anthropic from '@anthropic-ai/sdk';

let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) {
    return null;
  }
  if (!client) {
    client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return client;
}

export async function callClaude(systemPrompt: string, userMessage: string): Promise<string> {
  const anthropic = getAnthropicClient();
  if (!anthropic) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    system: systemPrompt,
    messages: [
      { role: 'user', content: userMessage },
    ],
  });

  const textBlock = response.content.find(block => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response from Claude');
  }
  return textBlock.text;
}

export function isAIAvailable(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

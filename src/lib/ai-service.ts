import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { Lead } from './types';

export type AiTask = 'summary' | 'score-explanation' | 'outreach';

function leadPrompt(lead: Lead, task: AiTask): string {
  const context = `Lead:\n- Name: ${lead.businessName}\n- Type: ${lead.businessType}\n- Location: ${lead.city}, ${lead.state}\n- Website: ${lead.website ?? 'None'}\n- Website quality: ${lead.websiteQuality}\n- Rating: ${lead.rating ?? 'Unknown'}\n- Reviews: ${lead.reviewCount ?? 'Unknown'}\n- Score: ${lead.score} (${lead.priority})\n- Opportunity tags: ${lead.tags.join(', ') || 'None'}\n- Existing notes: ${lead.notes}`;

  if (task === 'summary') {
    return `${context}\n\nWrite a concise lead summary with opportunity quality and two concrete next steps for a local web design sales workflow.`;
  }

  if (task === 'score-explanation') {
    return `${context}\n\nExplain why this lead is ${lead.priority} priority in 4 bullets tied to conversion and trust signals.`;
  }

  return `${context}\n\nDraft a short, human outreach message that is local, practical, and focused on helping this business get more calls and leads. Include a subject line and body.`;
}

function fallbackForTask(lead: Lead, task: AiTask): string {
  if (task === 'summary') {
    return `${lead.businessName} is a ${lead.businessType} lead in ${lead.city}, ${lead.state} with a ${lead.priority} opportunity profile (score ${lead.score}). Focus on a clean mobile-first site, strong call-to-action placement, and trust builders (reviews, service-area clarity, before/after proof). Next: 1) call with quick website audit, 2) send a one-page upgrade plan with timeline.`;
  }

  if (task === 'score-explanation') {
    return `Priority is ${lead.priority.toUpperCase()} because: ${lead.tags.join('; ') || 'current digital profile indicates conversion gaps'}. Lower review volume and weaker web presence usually translate into fast ROI for a web refresh focused on calls and quote requests.`;
  }

  return `Subject: Quick idea to help ${lead.businessName} get more local calls\n\nHi ${lead.businessName} team,\n\nI took a quick look at your online presence in ${lead.city}. I help local ${lead.businessType} companies improve their website and conversion flow so more visitors become calls and booked jobs.\n\nIf you want, I can send a short, no-pressure audit with 3 changes that would likely improve lead volume this month.\n\n- Jeremy\nHigh Ridge Web Design`;
}

export async function generateLeadAiText(lead: Lead, task: AiTask): Promise<{ text: string; usedFallback: boolean }> {
  const gatewayApiKey = process.env.AI_GATEWAY_API_KEY;

  if (!gatewayApiKey) {
    return { text: fallbackForTask(lead, task), usedFallback: true };
  }

  const openai = createOpenAI({
    apiKey: gatewayApiKey,
    baseURL: 'https://gateway.ai.vercel.sh/v1',
  });

  try {
    const { text } = await generateText({
      model: openai('openai/gpt-4.1-mini'),
      prompt: leadPrompt(lead, task),
      temperature: 0.5,
    });

    return { text, usedFallback: false };
  } catch {
    return { text: fallbackForTask(lead, task), usedFallback: true };
  }
}

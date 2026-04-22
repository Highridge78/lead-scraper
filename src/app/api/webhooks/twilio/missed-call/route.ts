import { createClient } from '@supabase/supabase-js';
import Twilio from 'twilio';

function xmlResponse(message: string) {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Say>${message}</Say>\n  <Hangup/>\n</Response>`, {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  });
}

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function getTwilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return null;
  return Twilio(sid, token);
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const from = (form.get('From') as string) || '';

    const supabase = getSupabaseClient();
    if (supabase && from) {
      await supabase.from('missed_call_events').insert({
        caller_phone: from,
        auto_text_sent: false,
      });
    }

    const twilio = getTwilioClient();
    const twilioFromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (twilio && supabase && from && twilioFromNumber) {
      await twilio.messages.create({
        body: 'Sorry we missed your call. What service do you need? Reply STOP to opt out.',
        to: from,
        from: twilioFromNumber,
      });

      await supabase
        .from('missed_call_events')
        .update({ auto_text_sent: true })
        .eq('caller_phone', from);
    }

    return xmlResponse('Sorry, we missed your call.');
  } catch (error) {
    console.error('twilio-webhook-error', error);
    return xmlResponse('There was an error.');
  }
}

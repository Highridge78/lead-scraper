export const dynamic = "force-dynamic";
import { supabase } from '@/lib/supabase'
import Twilio from 'twilio'

const twilio = Twilio(
  process.env.TWILIO_ACCOUNT_SID || 'AC-fake',
  process.env.TWILIO_AUTH_TOKEN || 'fake-token'
)

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const from = (form.get('From') as string) || ''
    const callSid = (form.get('CallSid') as string) || ''
    const callStatus = (form.get('CallStatus') as string) || ''

    console.log('TWILIO HIT', { from, callSid, callStatus })

    const { error: insertError } = await supabase
      .from('missed_call_events')
      .insert({
        caller_phone: from,
        auto_text_sent: false
      })

    if (insertError) {
      console.error('SUPABASE ERROR', insertError)
    } else {
      console.log('SUPABASE INSERT OK')
    }

    if (from && process.env.TWILIO_PHONE_NUMBER) {
      try {
        const msg = await twilio.messages.create({
          body: 'Sorry we missed your call. What service do you need? Reply STOP to opt out.',
          to: from,
          from: process.env.TWILIO_PHONE_NUMBER
        })

        console.log('SMS SENT', msg.sid)

        const { error: updateError } = await supabase
          .from('missed_call_events')
          .update({ auto_text_sent: true })
          .eq('caller_phone', from)

        if (updateError) {
          console.error('SUPABASE UPDATE ERROR', updateError)
        }
      } catch (smsError) {
        console.error('TWILIO SMS ERROR', smsError)
      }
    }

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Say>Sorry, we missed your call.</Say>\n  <Hangup/>\n</Response>`

    return new Response(twiml, {
      status: 200,
      headers: { 'Content-Type': 'text/xml' }
    })
  } catch (error) {
    console.error('WEBHOOK ERROR', error)

    return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Say>There was an error.</Say>\n  <Hangup/>\n</Response>`, {
      status: 200,
      headers: { 'Content-Type': 'text/xml' }
    })
  }
}

import { AppShell } from '@/components/app-shell';

function valueLabel(value: string | undefined) {
  if (!value) return 'Not configured';
  return 'Configured';
}

export default function SettingsPage() {
  const settings = {
    aiGatewayKey: valueLabel(process.env.AI_GATEWAY_API_KEY),
    supabaseUrl: valueLabel(process.env.NEXT_PUBLIC_SUPABASE_URL),
    supabaseServiceRole: valueLabel(process.env.SUPABASE_SERVICE_ROLE_KEY),
    twilioSid: valueLabel(process.env.TWILIO_ACCOUNT_SID),
    twilioFrom: valueLabel(process.env.TWILIO_PHONE_NUMBER),
    googlePlaces: valueLabel(process.env.GOOGLE_PLACES_API_KEY),
  };

  return (
    <AppShell>
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-2 text-zinc-400">Configuration visibility for AI, data, messaging, and general app behavior.</p>

      <div className="mt-6 grid gap-4">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-xl font-semibold">AI</h2>
          <p className="mt-2 text-sm text-zinc-400">AI tools use the Vercel AI Gateway when available and automatically fall back to built-in templates when unavailable.</p>
          <p className="mt-3 text-sm"><span className="text-zinc-400">AI_GATEWAY_API_KEY:</span> {settings.aiGatewayKey}</p>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-xl font-semibold">Supabase</h2>
          <p className="mt-2 text-sm text-zinc-400">If Supabase is configured, leads are stored in the leads table. Otherwise local file storage is used for local development.</p>
          <p className="mt-3 text-sm"><span className="text-zinc-400">NEXT_PUBLIC_SUPABASE_URL:</span> {settings.supabaseUrl}</p>
          <p className="mt-1 text-sm"><span className="text-zinc-400">SUPABASE_SERVICE_ROLE_KEY:</span> {settings.supabaseServiceRole}</p>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-xl font-semibold">Twilio</h2>
          <p className="mt-2 text-sm text-zinc-400">Twilio webhook route logs missed calls and sends follow-up SMS only when credentials are configured.</p>
          <p className="mt-3 text-sm"><span className="text-zinc-400">TWILIO_ACCOUNT_SID:</span> {settings.twilioSid}</p>
          <p className="mt-1 text-sm"><span className="text-zinc-400">TWILIO_PHONE_NUMBER:</span> {settings.twilioFrom}</p>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-xl font-semibold">General</h2>
          <p className="mt-2 text-sm text-zinc-400">Search provider defaults to mock mode when Google Places API is not configured, keeping the app functional locally.</p>
          <p className="mt-3 text-sm"><span className="text-zinc-400">GOOGLE_PLACES_API_KEY:</span> {settings.googlePlaces}</p>
        </section>
      </div>
    </AppShell>
  );
}

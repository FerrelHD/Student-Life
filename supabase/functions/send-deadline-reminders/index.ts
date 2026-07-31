// Supabase Edge Function: send-deadline-reminders
// Runs once a day (via pg_cron, see supabase/schema.sql) and sends a Web
// Push notification for every mission due tomorrow to that user's
// subscribed devices.
//
// Deploy:   supabase functions deploy send-deadline-reminders
// Secrets:  supabase secrets set VAPID_PUBLIC_KEY="..." VAPID_PRIVATE_KEY="..." VAPID_SUBJECT="mailto:you@example.com"

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import webpush from 'npm:web-push@3.6.7';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!;
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!;
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT')!;

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

interface DueMission {
  id: string;
  title: string;
  user_id: string;
}

Deno.serve(async () => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);

    const { data: missions, error: missionsError } = await supabase
      .from('missions')
      .select('id, title, user_id')
      .eq('date_str', tomorrowStr)
      .eq('completed', false)
      .returns<DueMission[]>();
    if (missionsError) throw missionsError;

    const userIds = [...new Set((missions ?? []).map((m) => m.user_id))];
    const { data: profiles } = userIds.length
      ? await supabase.from('profiles').select('id, language').in('id', userIds)
      : { data: [] as { id: string; language: string }[] };
    const languageByUser = new Map((profiles ?? []).map((p) => [p.id, p.language]));

    let sent = 0;
    let pruned = 0;

    for (const mission of missions ?? []) {
      const { data: subs, error: subsError } = await supabase
        .from('push_subscriptions')
        .select('endpoint, p256dh, auth')
        .eq('user_id', mission.user_id);
      if (subsError || !subs?.length) continue;

      const isId = (languageByUser.get(mission.user_id) ?? 'id') !== 'en';
      const payload = JSON.stringify({
        title: isId ? '⏰ Tenggat Besok' : '⏰ Deadline Tomorrow',
        body: isId ? `"${mission.title}" jatuh tempo besok.` : `"${mission.title}" is due tomorrow.`,
        url: './',
      });

      for (const sub of subs) {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            payload
          );
          sent++;
        } catch (err) {
          // 404/410 = the browser/OS revoked this subscription; anything else, keep it.
          const status = (err as { statusCode?: number }).statusCode;
          if (status === 404 || status === 410) {
            await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint);
            pruned++;
          } else {
            console.error('[send-deadline-reminders] push failed:', err);
          }
        }
      }
    }

    return new Response(JSON.stringify({ missionsDue: missions?.length ?? 0, sent, pruned }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

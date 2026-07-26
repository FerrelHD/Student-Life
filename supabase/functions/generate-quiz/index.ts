// Supabase Edge Function: generate-quiz
// Proxies a quiz-question request to the Gemini API so the API key never
// ships inside the Electron app bundle. Requires a signed-in Supabase user.
//
// Deploy:   supabase functions deploy generate-quiz
// Secret:   supabase secrets set GEMINI_API_KEY="..."

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

// Adjust if Google retires/renames this model — check available models in
// Google AI Studio if generation starts failing with a 404.
const GEMINI_MODEL = 'gemini-2.5-flash';

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

function buildPrompt(language: string, university: string): string {
  const isIndonesian = language !== 'en';
  return isIndonesian
    ? `Buat 1 soal kuis pilihan ganda singkat untuk mahasiswa${
        university ? ` di ${university}` : ''
      } seputar pengetahuan umum akademik, sains, sejarah, atau teknologi. Pilih topik acak, jangan berulang. Balas HANYA dengan JSON valid persis berbentuk: {"question": string, "options": [string, string, string, string], "correctIndex": number, "explanation": string}. correctIndex adalah index 0-3 dari jawaban benar di options. Gunakan Bahasa Indonesia.`
    : `Create 1 short multiple-choice quiz question for a university student${
        university ? ` at ${university}` : ''
      } about general academic knowledge, science, history, or technology. Pick a random topic, avoid repetition. Reply with ONLY valid JSON exactly shaped: {"question": string, "options": [string, string, string, string], "correctIndex": number, "explanation": string}. correctIndex is the 0-3 index of the correct option. Use English.`;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY secret is not set on this Supabase project');
    }

    // Require a real signed-in user (not just the anon key) before spending quota.
    const authHeader = req.headers.get('Authorization') ?? '';
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => ({}));
    const language: string = body.language ?? 'id';
    const university: string = body.university ?? '';

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(language, university) }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      throw new Error(`Gemini API error (${geminiRes.status}): ${errText}`);
    }

    const geminiJson = await geminiRes.json();
    const text = geminiJson.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Gemini returned no content');

    const quiz: QuizQuestion = JSON.parse(text);
    if (
      !quiz.question ||
      !Array.isArray(quiz.options) ||
      quiz.options.length !== 4 ||
      typeof quiz.correctIndex !== 'number'
    ) {
      throw new Error('Gemini returned a malformed quiz shape');
    }

    return new Response(JSON.stringify(quiz), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

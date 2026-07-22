const { createClient } = require('@supabase/supabase-js');

const KIMI_API_KEY = process.env.KIMI_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function callKimi(platformName, scrapedData) {
  const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${KIMI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'kimi-latest',
      messages: [
        {
          role: 'system',
          content: 'You generate structured data for an AI platform directory. Always return valid JSON with no markdown formatting.'
        },
        {
          role: 'user',
          content: `Generate a platform entry for: ${platformName}
          
Scraped data: ${scrapedData}

Return ONLY a JSON object with these exact fields:
- name (string)
- slug (lowercase, hyphenated, no special chars)
- company (string)
- best_for (one line, max 60 chars)
- api_available (boolean)
- self_hostable (boolean)
- free_tier (string or null)
- pricing_api (string, URL or price)
- hosting_options (array of strings)
- context_window (string)
- multimodal (boolean)
- open_weights (boolean)
- license (string)
- hyland_score (integer 1-100)
- description (exactly 2 sentences)
- quick_start (one command or URL)
- affiliate_link (URL)

Return raw JSON only. No markdown, no code blocks, no explanation.`
        }
      ],
      temperature: 0.3
    })
  });

  const result = await response.json();
  const content = result.choices[0].message.content;
  
  // Clean up any markdown formatting
  const cleanJson = content.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(cleanJson);
}

async function insertToSupabase(platformData) {
  const { data, error } = await supabase
    .from('platforms')
    .insert(platformData)
    .select();
    
  if (error) throw error;
  return data;
}

async function main() {
  // List of new platforms to add (you can modify this or make it dynamic)
  const newPlatforms = [
    'Mistral Small 3',
    'Gemma 3 4B',
    'DeepSeek V3',
    'Qwen 2.5 72B',
    'Llama 3.2 1B'
  ];

  for (const name of newPlatforms) {
    console.log(`Processing: ${name}`);
    try {
      const scraped = `Found mentions of ${name} on GitHub trending and Twitter tech community`;
      
      const data = await callKimi(name, scraped);
      console.log(`Generated: ${data.slug}`);
      
      await insertToSupabase(data);
      console.log(`✅ Inserted: ${data.name}`);
      
    } catch (error) {
      console.error(`❌ Error with ${name}:`, error.message);
    }
  }
}

main();
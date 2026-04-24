// ATS scoring: extract keywords from job description, match against resume,
// compute a weighted score. No external APIs — fully offline.

const STOP_WORDS = new Set([
  'a','an','the','and','or','but','if','then','else','of','for','to','in','on',
  'at','by','with','from','into','onto','out','over','under','as','is','are','was',
  'were','be','been','being','have','has','had','do','does','did','will','would',
  'should','could','may','might','can','shall','must','this','that','these','those',
  'i','you','he','she','it','we','they','me','him','her','us','them','my','your',
  'our','their','its','his','hers','ours','theirs','what','which','who','whom',
  'whose','where','when','why','how','all','any','both','each','few','more','most',
  'other','some','such','no','nor','not','only','own','same','so','than','too',
  'very','just','about','above','after','before','below','between','during','through',
  'again','once','here','there','also','yet','etc','eg','ie','ex','mr','ms','mrs',
  'etc.','i.e.','e.g.','within','while','without','among','up','down','well','new',
  'using','used','use','work','works','working','worked','ability','including','include',
]);

// Tech/skill keywords that carry higher weight
const TECH_KEYWORDS = new Set([
  'javascript','typescript','python','java','c++','c#','ruby','go','rust','php',
  'swift','kotlin','scala','perl','r','matlab','sql','nosql','mongodb','postgresql',
  'mysql','redis','react','angular','vue','svelte','node.js','nodejs','express',
  'django','flask','spring','laravel','rails','next.js','nuxt','html','css','sass',
  'tailwind','bootstrap','jquery','webpack','vite','babel','git','github','gitlab',
  'docker','kubernetes','aws','azure','gcp','jenkins','terraform','ansible','linux',
  'unix','windows','macos','android','ios','rest','graphql','grpc','api','microservices',
  'agile','scrum','kanban','devops','cicd','ci/cd','testing','jest','mocha','cypress',
  'selenium','junit','pytest','tdd','bdd','machine','learning','ml','ai','deep',
  'neural','tensorflow','pytorch','keras','pandas','numpy','scipy','sklearn','nlp',
  'computer','vision','data','analysis','analytics','visualization','tableau','powerbi',
  'excel','figma','sketch','photoshop','illustrator','ux','ui','design','wireframe',
  'prototype','responsive','accessibility','seo','marketing','sales','communication',
  'leadership','teamwork','problem-solving','analytical','creative','management',
  'project','product','customer','strategy','research','writing','editing','presenting',
  'negotiation','crm','erp','salesforce','hubspot','jira','confluence','slack','trello',
  'firebase','heroku','vercel','netlify','cloudflare','nginx','apache','elasticsearch',
  'kafka','rabbitmq','websocket','oauth','jwt','saml','ldap','sso','security','cybersecurity',
  'penetration','encryption','blockchain','solidity','ethereum','web3','mobile',
  'frontend','backend','fullstack','full-stack','full','stack','developer','engineer',
  'architect','analyst','scientist','administrator','lead','senior','junior','intern',
]);

/**
 * Normalize text: lowercase, strip punctuation, split into tokens.
 */
function tokenize(text = '') {
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s.+#/-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Extract meaningful keywords from a chunk of text (job description or resume).
 * Returns a Map of keyword -> frequency.
 */
function extractKeywords(text = '') {
  const tokens = tokenize(text);
  const freq = new Map();
  for (const t of tokens) {
    if (t.length < 2) continue;
    if (STOP_WORDS.has(t)) continue;
    if (/^\d+$/.test(t)) continue; // pure numbers
    freq.set(t, (freq.get(t) || 0) + 1);
  }
  // Also capture 2-grams (adjacent pairs) to catch multi-word keywords
  for (let i = 0; i < tokens.length - 1; i++) {
    const a = tokens[i], b = tokens[i + 1];
    if (STOP_WORDS.has(a) || STOP_WORDS.has(b)) continue;
    if (a.length < 2 || b.length < 2) continue;
    const bigram = `${a} ${b}`;
    freq.set(bigram, (freq.get(bigram) || 0) + 1);
  }
  return freq;
}

/**
 * Convert resume object into a single searchable text blob.
 */
function resumeToText(resume = {}) {
  if (!resume) return '';
  const parts = [];
  const p = resume.personalInfo || {};
  parts.push(p.fullName, p.jobTitle, p.email, p.phone, p.address, p.website, p.linkedin, p.github, p.summary);
  (resume.experience || []).forEach((e) => {
    parts.push(e.jobTitle, e.company, e.description);
  });
  (resume.education || []).forEach((e) => {
    parts.push(e.degree, e.institution, e.description);
  });
  (resume.skills || []).forEach((s) => parts.push(s));
  (resume.projects || []).forEach((pr) => {
    parts.push(pr.name, pr.description, pr.technologies);
  });
  (resume.certifications || []).forEach((c) => {
    parts.push(c.name, c.issuer);
  });
  (resume.achievements || []).forEach((a) => parts.push(a));
  return parts.filter(Boolean).join(' ');
}

/**
 * Score a resume against a job description.
 * Returns { score, matched, missing, total, details }
 */
function computeATSScore(resumeText, jobText, jobSkills = []) {
  const jobKeywords = extractKeywords(jobText);
  const resumeTokens = new Set(tokenize(resumeText));
  const resumeTextLower = String(resumeText).toLowerCase();

  // Rank job keywords by importance: frequency * (tech-boost if it's a known skill)
  const scored = [];
  for (const [kw, freq] of jobKeywords.entries()) {
    const isTech = TECH_KEYWORDS.has(kw) || TECH_KEYWORDS.has(kw.replace(/\s+/g, ''));
    const weight = freq * (isTech ? 2.5 : 1);
    scored.push({ kw, freq, weight, isTech });
  }
  // Add job's declared skills with maximum weight
  for (const s of jobSkills) {
    const low = String(s).toLowerCase().trim();
    if (!low) continue;
    const existing = scored.find((x) => x.kw === low);
    if (existing) {
      existing.weight += 5;
      existing.isTech = true;
    } else {
      scored.push({ kw: low, freq: 1, weight: 5, isTech: true });
    }
  }

  // Keep top 40 keywords as the ones we actually check
  const top = scored.sort((a, b) => b.weight - a.weight).slice(0, 40);

  const matched = [];
  const missing = [];
  let matchedWeight = 0;
  let totalWeight = 0;

  for (const item of top) {
    totalWeight += item.weight;
    const isMatch =
      resumeTokens.has(item.kw) ||
      resumeTextLower.includes(item.kw); // covers bigrams
    if (isMatch) {
      matched.push(item.kw);
      matchedWeight += item.weight;
    } else {
      missing.push(item.kw);
    }
  }

  const score = totalWeight === 0
    ? 0
    : Math.round((matchedWeight / totalWeight) * 100);

  // Additional structural checks (bonus/penalty)
  const checks = {
    hasEmail: /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/.test(resumeText),
    hasPhone: /(\+?\d[\d\s().-]{7,}\d)/.test(resumeText),
    hasExperience: /experience|work|employ|intern/i.test(resumeText),
    hasEducation: /education|degree|bachelor|master|university|college/i.test(resumeText),
    hasSkills: /skill/i.test(resumeText) || (top.some((t) => matched.includes(t.kw))),
    lengthOk: resumeText.length > 200 && resumeText.length < 8000,
  };

  let bonus = 0;
  if (checks.hasEmail) bonus += 2;
  if (checks.hasPhone) bonus += 2;
  if (checks.hasExperience) bonus += 2;
  if (checks.hasEducation) bonus += 2;
  if (checks.hasSkills) bonus += 1;
  if (checks.lengthOk) bonus += 1;

  const finalScore = Math.min(100, score + bonus);

  return {
    score: finalScore,
    rawKeywordScore: score,
    bonus,
    matchedKeywords: matched.slice(0, 25),
    missingKeywords: missing.slice(0, 25),
    totalKeywordsChecked: top.length,
    checks,
    suggestions: buildSuggestions(missing, checks),
  };
}

function buildSuggestions(missing, checks) {
  const s = [];
  if (!checks.hasEmail) s.push('Add a professional email address to your resume.');
  if (!checks.hasPhone) s.push('Include a phone number so recruiters can reach you.');
  if (!checks.hasExperience) s.push('Add a Work Experience section with clear job titles and dates.');
  if (!checks.hasEducation) s.push('Include your Education details (degree, institution, year).');
  if (!checks.lengthOk) s.push('Aim for a resume between 400–1500 words — concise but complete.');
  if (missing.length > 0) {
    s.push(`Consider incorporating these keywords from the job description: ${missing.slice(0, 8).join(', ')}.`);
  }
  if (s.length === 0) s.push('Your resume looks well-optimized for this job description!');
  return s;
}

module.exports = {
  tokenize,
  extractKeywords,
  resumeToText,
  computeATSScore,
};

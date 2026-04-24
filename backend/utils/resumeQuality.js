// Advanced resume quality analysis — goes beyond keyword matching.
// Detects action verbs, quantified achievements, passive voice, filler words,
// and produces a quality grade with actionable suggestions.

const STRONG_ACTION_VERBS = new Set([
  'achieved','accelerated','accomplished','administered','advised','analyzed',
  'architected','automated','built','boosted','collaborated','conceived',
  'conducted','consolidated','coordinated','created','cut','decreased',
  'delivered','designed','developed','devised','directed','drove','earned',
  'eliminated','enabled','engineered','enhanced','established','evaluated',
  'executed','expanded','expedited','forecasted','formulated','founded',
  'generated','grew','guided','headed','identified','implemented','improved',
  'increased','influenced','initiated','innovated','instituted','integrated',
  'introduced','launched','led','leveraged','managed','mentored','migrated',
  'minimized','modernized','monitored','negotiated','operated','optimized',
  'organized','overhauled','oversaw','performed','pioneered','planned',
  'prepared','presented','processed','produced','programmed','promoted',
  'proposed','published','rebuilt','recommended','reduced','refactored',
  'researched','resolved','restructured','revamped','saved','scaled',
  'secured','shipped','simplified','solved','spearheaded','standardized',
  'streamlined','strengthened','structured','supervised','supported',
  'surpassed','targeted','taught','tested','trained','transformed',
  'troubleshot','upgraded','validated','won','wrote',
]);

const WEAK_PHRASES = [
  'responsible for', 'worked on', 'helped with', 'assisted with',
  'tasked with', 'duties included', 'in charge of', 'was involved in',
  'was part of', 'had to', 'got to', 'worked with',
];

const FILLER_WORDS = new Set([
  'basically','actually','literally','simply','just','very','really',
  'quite','rather','somewhat','pretty','fairly','kind','sort',
]);

const BUZZWORD_OVERUSE_LIMIT = 3;
const TRACKED_BUZZWORDS = new Set([
  'synergy','synergies','leverage','leveraged','leveraging','go-getter',
  'think outside the box','team player','results-driven','detail-oriented',
  'self-motivated','hard-working','dynamic','proactive','passionate',
  'enthusiastic','motivated','dedicated','out-of-the-box','value-add',
  'best of breed','hit the ground running','rockstar','guru','ninja',
]);

// Passive voice detector — rough but effective: "was/were/been + past participle"
const PASSIVE_PATTERNS = [
  /\b(was|were|been|being|is|are|am)\s+\w+ed\b/gi,
  /\b(was|were|been|being|is|are|am)\s+(given|taken|shown|sent|made|done|written|built|developed|managed|led|designed|created)\b/gi,
];

/**
 * Analyzes the resume text and returns a detailed quality report.
 */
function analyzeResumeQuality(text = '') {
  if (!text || text.trim().length < 50) {
    return {
      overallGrade: 'F',
      overallScore: 0,
      message: 'Not enough content to analyze. Add more detail to your resume.',
      checks: {},
      issues: [],
      highlights: [],
    };
  }

  const lower = text.toLowerCase();
  const sentences = text
    .split(/[.!?\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);
  const words = text.split(/\s+/).filter(Boolean);

  // --- CHECK 1: Action verbs ---
  const firstWords = sentences
    .map((s) => s.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, ''))
    .filter(Boolean);
  const actionVerbCount = firstWords.filter((w) => STRONG_ACTION_VERBS.has(w)).length;
  const actionVerbRatio = sentences.length ? actionVerbCount / sentences.length : 0;
  const foundActionVerbs = [...new Set(firstWords.filter((w) => STRONG_ACTION_VERBS.has(w)))];

  // --- CHECK 2: Quantified achievements (numbers, %, $) ---
  const quantifiedMatches = text.match(/\b\d+(\.\d+)?\s*(%|\+|x|k|K|M|B|m|million|billion|thousand|hours|users|customers|clients|\$|₹|€|£)\b/g) || [];
  const quantifiedCount = quantifiedMatches.length;
  const quantifiedRatio = sentences.length ? quantifiedCount / sentences.length : 0;

  // --- CHECK 3: Weak phrases ---
  const foundWeakPhrases = [];
  for (const phrase of WEAK_PHRASES) {
    if (lower.includes(phrase)) foundWeakPhrases.push(phrase);
  }

  // --- CHECK 4: Passive voice ---
  let passiveCount = 0;
  const passiveExamples = [];
  for (const pattern of PASSIVE_PATTERNS) {
    const matches = text.match(pattern) || [];
    passiveCount += matches.length;
    matches.slice(0, 2).forEach((m) => {
      if (!passiveExamples.includes(m)) passiveExamples.push(m);
    });
  }

  // --- CHECK 5: Filler words ---
  let fillerCount = 0;
  for (const word of words) {
    const clean = word.toLowerCase().replace(/[^a-z]/g, '');
    if (FILLER_WORDS.has(clean)) fillerCount++;
  }

  // --- CHECK 6: Buzzword overuse ---
  const foundBuzzwords = [];
  for (const buzz of TRACKED_BUZZWORDS) {
    const count = (lower.match(new RegExp(`\\b${buzz}\\b`, 'g')) || []).length;
    if (count > 0) foundBuzzwords.push({ word: buzz, count });
  }
  const totalBuzzwordUse = foundBuzzwords.reduce((s, b) => s + b.count, 0);

  // --- CHECK 7: Bullet point length ---
  // Split by newline or ; — heuristic for bullet points
  const bullets = text
    .split(/\n|•|▪|▸|–|—|;/)
    .map((b) => b.trim())
    .filter((b) => b.length > 10 && b.length < 500);
  const bulletWordCounts = bullets.map((b) => b.split(/\s+/).length);
  const avgBulletLength = bulletWordCounts.length
    ? Math.round(bulletWordCounts.reduce((a, b) => a + b, 0) / bulletWordCounts.length)
    : 0;
  const tooLongBullets = bulletWordCounts.filter((n) => n > 35).length;
  const tooShortBullets = bulletWordCounts.filter((n) => n < 8).length;

  // --- SCORING ---
  let score = 100;
  const issues = [];
  const highlights = [];

  // Action verbs — ideal ratio > 0.4
  if (actionVerbRatio > 0.5) {
    highlights.push(`Great use of action verbs (${actionVerbCount} strong verbs found)`);
  } else if (actionVerbRatio > 0.25) {
    score -= 8;
    issues.push({
      type: 'warning',
      title: 'Use more action verbs',
      detail: `Only ${actionVerbCount} of your ${sentences.length} sentences start with a strong action verb. Try: achieved, built, led, designed, increased, reduced.`,
    });
  } else {
    score -= 18;
    issues.push({
      type: 'error',
      title: 'Very few action verbs',
      detail: `Start bullet points with powerful verbs instead of "Worked on" or "Responsible for". Examples: led, built, designed, launched, optimized.`,
    });
  }

  // Quantified achievements — target > 0.3 ratio
  if (quantifiedCount >= 5) {
    highlights.push(`Strong use of metrics (${quantifiedCount} quantified results)`);
  } else if (quantifiedCount >= 2) {
    score -= 10;
    issues.push({
      type: 'warning',
      title: 'Add more numbers',
      detail: `Only ${quantifiedCount} quantified results found. Add percentages, dollar amounts, team sizes, or timeframes. "Increased sales by 30%" beats "improved sales".`,
    });
  } else {
    score -= 20;
    issues.push({
      type: 'error',
      title: 'Missing quantified achievements',
      detail: 'Recruiters want numbers. Replace vague claims with specifics like "reduced load time by 40%", "managed a team of 8", "saved $50K annually".',
    });
  }

  // Weak phrases
  if (foundWeakPhrases.length === 0) {
    highlights.push('No weak phrases detected');
  } else {
    score -= Math.min(15, foundWeakPhrases.length * 4);
    issues.push({
      type: 'warning',
      title: `Replace ${foundWeakPhrases.length} weak phrase${foundWeakPhrases.length > 1 ? 's' : ''}`,
      detail: `Avoid: "${foundWeakPhrases.slice(0, 3).join('", "')}". These sound passive. Use action verbs instead.`,
    });
  }

  // Passive voice
  if (passiveCount <= 2) {
    highlights.push('Active voice throughout');
  } else if (passiveCount <= 5) {
    score -= 8;
    issues.push({
      type: 'warning',
      title: `${passiveCount} passive voice constructions`,
      detail: `Passive voice weakens impact. ${passiveExamples.length > 0 ? `Example: "${passiveExamples[0]}".` : ''} Rewrite in active voice.`,
    });
  } else {
    score -= 15;
    issues.push({
      type: 'error',
      title: `Excessive passive voice (${passiveCount} instances)`,
      detail: `Rewrite sentences in active voice. "Was responsible for managing" → "Managed".`,
    });
  }

  // Filler words
  if (fillerCount > 5) {
    score -= Math.min(10, fillerCount);
    issues.push({
      type: 'warning',
      title: `Remove ${fillerCount} filler words`,
      detail: 'Words like "very", "really", "just", "basically" weaken your writing. Cut them.',
    });
  }

  // Buzzword overuse
  if (totalBuzzwordUse > BUZZWORD_OVERUSE_LIMIT) {
    score -= 10;
    issues.push({
      type: 'warning',
      title: `Too many generic buzzwords (${totalBuzzwordUse} instances)`,
      detail: `Words like "${foundBuzzwords.slice(0, 3).map((b) => b.word).join('", "')}" are everywhere. Replace them with specific achievements.`,
    });
  } else if (totalBuzzwordUse === 0) {
    highlights.push('No generic buzzword overuse');
  }

  // Bullet length
  if (tooLongBullets > 3) {
    score -= 8;
    issues.push({
      type: 'warning',
      title: `${tooLongBullets} bullet points are too long`,
      detail: 'Keep bullets to 15–25 words. Break long ones into two or trim fluff.',
    });
  }
  if (tooShortBullets > 5) {
    score -= 5;
    issues.push({
      type: 'info',
      title: `${tooShortBullets} bullet points are very short`,
      detail: 'Flesh out short bullets with the impact — what did it achieve? What metric moved?',
    });
  }
  if (avgBulletLength >= 12 && avgBulletLength <= 28) {
    highlights.push(`Good bullet point length (avg ${avgBulletLength} words)`);
  }

  score = Math.max(0, Math.min(100, score));

  // Grade
  let overallGrade = 'A+';
  if (score < 55) overallGrade = 'D';
  else if (score < 65) overallGrade = 'C';
  else if (score < 75) overallGrade = 'C+';
  else if (score < 82) overallGrade = 'B';
  else if (score < 88) overallGrade = 'B+';
  else if (score < 93) overallGrade = 'A';

  return {
    overallGrade,
    overallScore: score,
    checks: {
      actionVerbCount,
      actionVerbRatio: Math.round(actionVerbRatio * 100),
      foundActionVerbs: foundActionVerbs.slice(0, 10),
      quantifiedCount,
      quantifiedMatches: quantifiedMatches.slice(0, 8),
      weakPhrases: foundWeakPhrases,
      passiveCount,
      passiveExamples,
      fillerCount,
      buzzwordCount: totalBuzzwordUse,
      buzzwords: foundBuzzwords.slice(0, 5),
      bulletCount: bullets.length,
      avgBulletLength,
      tooLongBullets,
      tooShortBullets,
      totalSentences: sentences.length,
      totalWords: words.length,
    },
    issues,
    highlights,
  };
}

module.exports = { analyzeResumeQuality };

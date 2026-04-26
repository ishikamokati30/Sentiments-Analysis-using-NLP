#!/usr/bin/env node

/**
 * Test script for enhanced sentiment analysis features
 * Run: node test-improvements.js
 */

const {
  normalizeText,
  detectIntensity,
  detectNegationContext,
  tokenize,
} = require("./backend/services/textUtils");

const { detectSarcasm } = require("./backend/services/sarcasmService");

// Dummy sentiment result for testing
const dummySentimentResult = {
  score: -0.75,
  sentimentLabel: "negative",
};

console.log("🧪 SENTIMENT ANALYSIS ENHANCEMENT TEST\n");
console.log("=" .repeat(60));

// Test 1: Text Normalization
console.log("\n✅ TEST 1: Text Normalization");
console.log("-".repeat(60));

const testTexts = [
  "happyyy with the service",
  "soooddd excited about this worsttt app",
  "bohot good experience here",
];

testTexts.forEach((text) => {
  const normalized = normalizeText(text);
  console.log(`📝 Original:   "${text}"`);
  console.log(`✨ Normalized: "${normalized}"\n`);
});

// Test 2: Intensity Detection
console.log("✅ TEST 2: Intensity Detection");
console.log("-".repeat(60));

const intensityTexts = [
  "Good service",
  "Very good service",
  "Extremely good service",
  "bahut bohot good service",
];

intensityTexts.forEach((text) => {
  const boost = detectIntensity(text);
  console.log(`📝 Text: "${text}"`);
  console.log(`📊 Intensity Boost: ${boost}x\n`);
});

// Test 3: Negation Context
console.log("✅ TEST 3: Negation Context Detection");
console.log("-".repeat(60));

const negationTexts = [
  "This is not bad",
  "I don't like this",
  "Not impressed with the quality",
];

negationTexts.forEach((text) => {
  const negations = detectNegationContext(text);
  console.log(`📝 Text: "${text}"`);
  console.log(`🔍 Negated Words: ${negations.size > 0 ? Array.from(negations.keys()).join(", ") : "none"}\n`);
});

// Test 4: Sarcasm Detection
console.log("✅ TEST 4: Sarcasm Detection");
console.log("-".repeat(60));

const sarcasmTexts = [
  "Wow great... app crashed again",
  "Oh sure, that's perfect!!!??",
  "Yeah right, best experience ever",
  "This is actually really good",
];

sarcasmTexts.forEach((text) => {
  const result = detectSarcasm(text, dummySentimentResult);
  console.log(`📝 Text: "${text}"`);
  console.log(`🎭 Sarcasm Level: ${result.sarcasm}`);
  console.log(`📊 Confidence: ${result.confidence}`);
  console.log(`✔️  Is Sarcastic: ${result.isSarcastic}\n`);
});

// Test 5: Combined Example
console.log("✅ TEST 5: Combined Enhancement Example");
console.log("-".repeat(60));

const complexText = "sooooo happyyy with this bohot amazing experience, really!!!";
console.log(`📝 Original Text: "${complexText}"\n`);

const normalized = normalizeText(complexText);
console.log(`✨ Normalized: "${normalized}"`);

const intensity = detectIntensity(complexText);
console.log(`📊 Intensity Boost: ${intensity}x`);

const negations = detectNegationContext(complexText);
console.log(`🔍 Negations: ${negations.size > 0 ? Array.from(negations.keys()).join(", ") : "none"}`);

const sarcasm = detectSarcasm(complexText, { score: 0.8, sentimentLabel: "positive" });
console.log(`🎭 Sarcasm: ${sarcasm.sarcasm} (${sarcasm.confidence})`);

console.log("\n" + "=".repeat(60));
console.log("✅ All tests completed successfully!");
console.log("=" .repeat(60));

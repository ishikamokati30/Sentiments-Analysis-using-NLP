const { runAdvancedAnalysis, createLegacyAnalysis } = require("../services/nlpService");

async function analyzeText(text) {
  const advanced = await runAdvancedAnalysis(text);
  return createLegacyAnalysis(advanced);
}

module.exports = {
  analyzeText,
};

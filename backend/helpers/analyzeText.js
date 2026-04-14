const { runLocalAdvancedAnalysis, createLegacyAnalysis } = require("../services/nlpService");

function analyzeText(text) {
  const advanced = runLocalAdvancedAnalysis(text);
  return createLegacyAnalysis(advanced);
}

module.exports = {
  analyzeText,
};

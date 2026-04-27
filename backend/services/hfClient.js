const cache = new Map();

async function queryModel(model, inputs, options = {}) {
  if (!process.env.HUGGINGFACE_API_KEY || typeof fetch !== "function") {
    return null;
  }

  const cacheKey = JSON.stringify({ model, inputs });
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs,
          options: {
            wait_for_model: true,
            use_cache: true,
            ...options,
          },
        }),
      },
    );

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    cache.set(cacheKey, payload);
    return payload;
  } catch {
    return null;
  }
}

module.exports = {
  queryModel,
};

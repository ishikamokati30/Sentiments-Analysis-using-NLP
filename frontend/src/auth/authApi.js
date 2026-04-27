import { api } from "../api/sentimentApi";

function createFallbackToken(user) {
  return `local.${btoa(JSON.stringify({ sub: user.email, name: user.name || "Analyst" }))}.token`;
}

function persistFallbackUser(user) {
  const existing = JSON.parse(
    window.localStorage.getItem("sentiment-users") || "[]",
  );
  const filtered = existing.filter((item) => item.email !== user.email);
  const next = [...filtered, user];
  window.localStorage.setItem("sentiment-users", JSON.stringify(next));
}

export async function signupRequest(payload) {
  try {
    const { data } = await api.post("/auth/signup", payload);
    return data;
  } catch (error) {
    if (error.response?.status && error.response.status !== 404) {
      throw error;
    }

    const user = {
      name: payload.name,
      email: payload.email,
      password: payload.password,
    };
    persistFallbackUser(user);
    return {
      token: createFallbackToken(user),
      user: { name: user.name, email: user.email },
    };
  }
}

export async function loginRequest(payload) {
  try {
    const { data } = await api.post("/auth/login", payload);
    return data;
  } catch (error) {
    if (error.response?.status && error.response.status !== 404) {
      throw error;
    }

    const existing = JSON.parse(
      window.localStorage.getItem("sentiment-users") || "[]",
    );
    const matched = existing.find(
      (item) =>
        item.email === payload.email && item.password === payload.password,
    );

    if (!matched) {
      throw new Error("Invalid email or password.");
    }

    return {
      token: createFallbackToken(matched),
      user: { name: matched.name, email: matched.email },
    };
  }
}

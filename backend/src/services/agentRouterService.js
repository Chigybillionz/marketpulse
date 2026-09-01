const { OpenAI } = require('openai');

const agentRouterClient = new OpenAI({
  baseURL: process.env.AGENTROUTER_BASE_URL || 'https://agentrouter.org/v1',
  apiKey: process.env.AGENTROUTER_API_KEY,
});

/**
 * Query Claude models (e.g. Opus or Sonnet) via AgentRouter
 */
async function queryClaude(prompt, model = 'claude-3-opus-20240229') {
  try {
    const response = await agentRouterClient.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('AgentRouter Claude Error:', error.message);
    throw error;
  }
}

/**
 * Query GPT models (e.g. GPT-4o or GPT-4.5) via AgentRouter
 */
async function queryGPT(prompt, model = 'gpt-4o') {
  try {
    const response = await agentRouterClient.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('AgentRouter GPT Error:', error.message);
    throw error;
  }
}

module.exports = {
  queryClaude,
  queryGPT,
  agentRouterClient,
};

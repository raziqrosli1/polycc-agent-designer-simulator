export interface DeepSeekEnvConfig {
  apiKey: string
  baseUrl: string
  model: string
}

export const getDeepSeekEnvConfig = (): DeepSeekEnvConfig => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY?.trim()
  const baseUrl =
    import.meta.env.VITE_DEEPSEEK_BASE_URL?.trim() || 'https://api.deepseek.com'
  const model = import.meta.env.VITE_DEEPSEEK_MODEL?.trim() || 'deepseek-v4-flash'

  if (!apiKey) {
    throw new Error(
      'DeepSeek API key is missing. Set VITE_DEEPSEEK_API_KEY in your local .env file.',
    )
  }

  return {
    apiKey,
    baseUrl: baseUrl.replace(/\/$/, ''),
    model,
  }
}

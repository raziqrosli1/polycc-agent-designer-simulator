interface JsonRequestOptions {
  timeoutMs?: number
}

export async function postJson<TResponse>(
  url: string,
  body: unknown,
  headers: Record<string, string> = {},
  options: JsonRequestOptions = {},
): Promise<TResponse> {
  const controller = new AbortController()
  const timeoutMs = options.timeoutMs ?? 30000
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    const text = await response.text()

    if (!response.ok) {
      const detail = text ? ` ${text}` : ''
      throw new Error(`Request failed with status ${response.status}.${detail}`)
    }

    if (!text.trim()) {
      throw new Error('The service returned an empty response.')
    }

    try {
      return JSON.parse(text) as TResponse
    } catch {
      throw new Error('The service returned a non-JSON response.')
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`The request timed out after ${Math.round(timeoutMs / 1000)} seconds.`)
    }

    throw error
  } finally {
    window.clearTimeout(timeoutId)
  }
}

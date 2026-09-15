import Vapi from '@vapi-ai/web'

const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY || '1dacf6a7-0ebc-40ac-b154-59fbb0d03f2f'
const VAPI_INSTANCE_KEY = '__madadkorVapiInstance'

export function getVapi() {
  if (typeof window === 'undefined') return null

  if (!window[VAPI_INSTANCE_KEY]) {
    window[VAPI_INSTANCE_KEY] = new Vapi(VAPI_PUBLIC_KEY)
  }

  return window[VAPI_INSTANCE_KEY]
}

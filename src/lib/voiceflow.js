// Voiceflow vaqtincha ishlatilmaydi. Eski tugmalar Vapi call-center'ni ishga tushiradi.
export function openVoiceflowChat(message = '') {
  window.dispatchEvent(new CustomEvent('madadkor:start-call', { detail: { message } }))
}

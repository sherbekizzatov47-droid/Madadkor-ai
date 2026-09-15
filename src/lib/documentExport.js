function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function downloadWord(text, filename = 'madadkor-ariza.doc') {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Madadkor AI — Ariza</title>
  <style>body{font-family:"Times New Roman",serif;font-size:12pt;line-height:1.6;margin:40px;color:#111}pre{font-family:"Times New Roman",serif;white-space:pre-wrap;word-wrap:break-word}</style>
  </head><body><pre>${escapeHtml(text)}</pre></body></html>`
  const blob = new Blob(['\\ufeff', html], { type: 'application/msword;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.doc') ? filename : `${filename}.doc`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function printAsPdf(text, title = 'Madadkor AI — Ariza') {
  // Open immediately from the user's click so the browser does not block the popup.
  const printWindow = window.open('', '_blank', 'width=900,height=1000')

  if (!printWindow) {
    window.alert('PDF oynasi bloklangan. Brauzerning manzil qatoridagi oynalarni bloklash belgisidan ushbu saytga ruxsat bering va PDF tugmasini yana bosing.')
    return
  }

  const safeTitle = escapeHtml(title)
  const html = `<!doctype html>
<html lang="uz">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${safeTitle}</title>
  <style>
    @page { size: A4; margin: 20mm 18mm 20mm 22mm; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: "Times New Roman", serif; color: #111; background: #fff; }
    .toolbar { position: sticky; top: 0; padding: 12px; background: #f3f4f6; border-bottom: 1px solid #d1d5db; font-family: Arial, sans-serif; }
    .toolbar button { padding: 9px 14px; border: 0; border-radius: 6px; cursor: pointer; background: #111827; color: #fff; font-weight: 600; }
    .toolbar span { margin-left: 10px; font-size: 13px; color: #4b5563; }
    .document { padding: 10px 0; }
    pre { white-space: pre-wrap; word-break: break-word; font: 12pt/1.65 "Times New Roman", serif; margin: 0; }
    @media print {
      .toolbar { display: none; }
      .document { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <button id="printBtn" type="button">PDF sifatida saqlash</button>
    <span>Ochilgan oynada Print → Save as PDF ni tanlang.</span>
  </div>
  <main class="document"><pre>${escapeHtml(text)}</pre></main>
  <script>
    const printBtn = document.getElementById('printBtn');
    printBtn.addEventListener('click', () => window.print());
    window.addEventListener('load', () => {
      setTimeout(() => window.print(), 500);
    });
  </script>
</body>
</html>`

  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
  printWindow.focus()
}

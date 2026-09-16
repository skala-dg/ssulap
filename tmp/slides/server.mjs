import http from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'

const root = new URL('../../dist/', import.meta.url)
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
}

http
  .createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname)
      const relative = pathname.startsWith('/ssulap/') ? pathname.slice('/ssulap/'.length) : 'index.html'
      const file = join(root.pathname.slice(1), relative || 'index.html')
      const bytes = await readFile(file)
      response.writeHead(200, { 'content-type': mime[extname(file)] || 'application/octet-stream' })
      response.end(bytes)
    } catch {
      const bytes = await readFile(new URL('index.html', root))
      response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
      response.end(bytes)
    }
  })
  .listen(4173, '127.0.0.1', () => console.log('SSULAP preview: http://127.0.0.1:4173/ssulap/'))

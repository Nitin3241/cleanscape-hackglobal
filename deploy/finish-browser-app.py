"""Finishes the browser build of the app (see build-browser-app.sh).

1. Expo puts fonts and icons that come from packages under assets/node_modules. Git and Docker both skip any
   folder called node_modules, so those files never reached the server and the app fell back to a serif font.
   They are moved to assets/vendor and every mention of the old path is rewritten.
2. The page that loads the app gets what a phone browser needs: no zoom when a text box is tapped, a line of
   text while the app loads, a move to the https address (the microphone and camera only work there), and a
   phone-sized column when it is opened on a wide screen.
3. Large text files get a gzipped copy beside them, which the server sends to browsers that accept gzip.
4. The result replaces server/static/app.
"""
import gzip
import os
import shutil
import sys

dist, target = sys.argv[1], sys.argv[2]

# 1. assets/node_modules -> assets/vendor
old, new = os.path.join(dist, "assets", "node_modules"), os.path.join(dist, "assets", "vendor")
if os.path.isdir(old):
    os.rename(old, new)
for folder, _, names in os.walk(dist):
    for name in names:
        if not name.endswith((".js", ".html", ".json", ".css", ".map")):
            continue
        path = os.path.join(folder, name)
        text = open(path, encoding="utf-8").read()
        if "assets/node_modules" in text:
            open(path, "w", encoding="utf-8").write(text.replace("assets/node_modules", "assets/vendor"))

# 2. the page
page = os.path.join(dist, "index.html")
html = open(page, encoding="utf-8").read()

VIEWPORT = '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />'
assert VIEWPORT in html, "Expo changed its page template: check the viewport line"
html = html.replace(
    VIEWPORT,
    # maximum-scale=1 stops an iPhone zooming in when a text box is tapped.
    '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no" />\n'
    '    <meta name="theme-color" content="#ffffff" />\n'
    '    <meta name="apple-mobile-web-app-capable" content="yes" />\n'
    '    <meta name="mobile-web-app-capable" content="yes" />\n'
    '    <meta name="apple-mobile-web-app-title" content="CleanScape" />',
)

HEAD = """<style>
      html { color-scheme: light only; -webkit-text-size-adjust: 100%; }
      /* Feels like an app: no pull-to-refresh, no grey flash on tap. */
      body { overscroll-behavior: none; -webkit-tap-highlight-color: transparent; background: #fff; }
      /* Shown until the app has loaded. */
      #boot { position: fixed; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px;
        background: #fff; color: #50636B; font: 500 15px/22px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; z-index: 10; }
      #boot i { width: 28px; height: 28px; border-radius: 50%; border: 3px solid #E6F3F8; border-top-color: #1E6280; animation: boot-spin 0.9s linear infinite; }
      @keyframes boot-spin { to { transform: rotate(360deg); } }
      @media (prefers-reduced-motion: reduce) { #boot i { animation: none; } }
      /* On a wide screen the app sits in a phone-sized column, centred. */
      @media (min-width: 520px) {
        body { background: #E6F3F8; }
        #root, #boot { max-width: 430px; max-height: 932px; margin: auto; border-radius: 40px; }
        #root { position: relative; top: 50%; transform: translateY(-50%); overflow: hidden; box-shadow: 0 12px 48px rgba(18,37,46,.18); background: #fff; }
        #boot { inset: 0; height: 100%; }
      }
    </style>
    <script>
      // The microphone and camera only work on the https address. If this page was opened on the plain one
      // and the https address answers, move there. (a.b.c.d becomes a-b-c-d.sslip.io, which has a certificate.)
      (function () {
        var host = location.hostname;
        if (location.protocol !== 'http:' || !/^\\d+\\.\\d+\\.\\d+\\.\\d+$/.test(host) || host === '127.0.0.1') return;
        var secure = 'https://' + host.replace(/\\./g, '-') + '.sslip.io';
        fetch(secure + '/health', { cache: 'no-store' })
          .then(function (answer) { if (answer.ok) location.replace(secure + location.pathname + location.search + location.hash); })
          .catch(function () {});
      })();
    </script>
  <link rel="icon\""""
assert html.count('<link rel="icon"') == 1, "Expo changed its page template: check the icon line"
html = html.replace('<link rel="icon"', HEAD, 1)

BODY = """<div id="boot" role="status"><i></i>Opening CleanScape</div>
    <script>
      // Take the loading line away once the app has drawn itself.
      (function () {
        var root = document.getElementById('root'), boot = document.getElementById('boot');
        var done = function () { if (boot && boot.parentNode) boot.parentNode.removeChild(boot); };
        new MutationObserver(function (_, watcher) { if (root.firstChild) { watcher.disconnect(); done(); } }).observe(root, { childList: true });
        setTimeout(done, 20000);
      })();
    </script>
  <script src="""
assert '<script src=' in html
html = html.replace("<script src=", BODY, 1)
open(page, "w", encoding="utf-8").write(html)

# 3. a gzipped copy beside each large text file; the server sends it to browsers that accept gzip
for folder, _, names in os.walk(dist):
    for name in names:
        path = os.path.join(folder, name)
        if name.endswith((".js", ".css", ".json", ".svg", ".ttf")) and os.path.getsize(path) > 2048:
            with open(path, "rb") as plain, gzip.open(path + ".gz", "wb", compresslevel=9) as packed:
                shutil.copyfileobj(plain, packed)

# 4. into the server
if os.path.isdir(target):
    shutil.rmtree(target)
shutil.copytree(dist, target)
print(f"{sum(len(names) for _, _, names in os.walk(target))} files")

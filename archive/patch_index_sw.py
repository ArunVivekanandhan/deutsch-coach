import re

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

sw_registration = """
<!-- Register Service Worker for PWA -->
<script>
if("serviceWorker" in navigator && (location.protocol==="https:" || location.hostname==="localhost" || location.hostname==="127.0.0.1")){
  window.addEventListener("load", ()=>{
    navigator.serviceWorker.register("sw.js").catch(()=>{});
  });
}
</script>
</body>
"""

if "navigator.serviceWorker.register" not in content:
    content = content.replace("</body>", sw_registration)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Injected Service Worker into index.html")

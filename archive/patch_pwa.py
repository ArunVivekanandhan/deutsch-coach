import re

with open("js/app-shell.js", "r", encoding="utf-8") as f:
    content = f.read()

# Add PWA mobile meta tags and Service Worker registration
pwa_inject = """
    // Inject Mobile & PWA tags if not present
    if (!document.querySelector('link[rel="manifest"]')) {
        const manifest = document.createElement('link');
        manifest.rel = "manifest";
        manifest.href = "manifest.json";
        document.head.appendChild(manifest);
    }
    if (!document.querySelector('link[rel="apple-touch-icon"]')) {
        const appleIcon = document.createElement('link');
        appleIcon.rel = "apple-touch-icon";
        appleIcon.href = "icon-192.png";
        document.head.appendChild(appleIcon);
    }
    if (!document.querySelector('meta[name="theme-color"]')) {
        const themeColor = document.createElement('meta');
        themeColor.name = "theme-color";
        themeColor.content = "#1B2A4A";
        document.head.appendChild(themeColor);
    }
    if (!document.querySelector('meta[name="viewport"]')) {
        const viewport = document.createElement('meta');
        viewport.name = "viewport";
        viewport.content = "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes";
        document.head.appendChild(viewport);
    }

    // Register Service Worker for PWA (Installable on Mobile)
    if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("sw.js").catch(err => console.log("SW Registration failed: ", err));
        });
    }
"""

if "apple-touch-icon" not in content:
    content = content.replace(
        "    // Inject design-system.css if not present",
        pwa_inject + "\n    // Inject design-system.css if not present"
    )

with open("js/app-shell.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Injected PWA/Mobile tags into app-shell.js")

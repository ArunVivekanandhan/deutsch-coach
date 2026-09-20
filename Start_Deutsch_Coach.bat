@echo off
echo ==========================================
echo Starting Deutsch-Coach + Ollama Proxy
echo ==========================================
echo.
echo Starting the Ollama Cloud CORS Proxy...
start "Ollama Proxy" cmd /c "node ollama_proxy.js"

echo Opening Deutsch-Coach in your default browser...
start index.html

echo.
echo The app is now open! 
echo A separate black terminal window is running the proxy. You can close that terminal window when you are done studying to stop the proxy.
pause

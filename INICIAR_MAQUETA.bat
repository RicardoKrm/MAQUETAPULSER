@echo off
title PULSER DEMO - Maqueta Comercial
color 0B
echo ======================================================================
echo          PULSER DEMO - MAQUETA COMERCIAL PARA CLIENTES
echo ======================================================================
echo.
echo Iniciando servidor local en http://localhost:3000 ...
echo.

cd /d "%~dp0"

:: Abrir navegador automaticamente despues de 4 segundos directo al dashboard
start "" cmd /c "timeout /t 4 /nobreak >nul && start http://localhost:3000/dashboard"

:: Ejecutar servidor de la maqueta
call npm run dev

pause

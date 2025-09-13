@echo off
echo Starting database export...

REM Read the DATABASE_URL from .env file
for /f "tokens=1,2 delims==" %%a in (.env) do (
    if "%%a"=="DATABASE_URL" set DATABASE_URL=%%b
)

REM Parse connection details from DATABASE_URL
REM Expected format: postgresql://username:password@host:port/database

echo DATABASE_URL: %DATABASE_URL%

REM Create exports directory if it doesn't exist
if not exist "exports" mkdir exports

REM Set timestamp for backup file
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%%MM%%DD%_%HH%%Min%%Sec%"

REM You'll need to manually extract connection details from your DATABASE_URL
echo.
echo Please run the appropriate pg_dump command with your connection details:
echo.
echo pg_dump -h [host] -p [port] -U [username] -d [database] --clean --create --inserts -f exports/database_backup_%timestamp%.sql
echo.
echo Or for a compressed backup:
echo pg_dump -h [host] -p [port] -U [username] -d [database] --clean --create -Fc -f exports/database_backup_%timestamp%.backup
echo.
pause
@echo off
echo Starting GitPulse development server...
cd apps\web
node ..\..\node_modules\.pnpm\next@15.0.7_@opentelemetry+_99d90ad1d6f23b792b09d84486b67485\node_modules\next\dist\bin\next dev

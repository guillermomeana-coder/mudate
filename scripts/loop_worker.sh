#!/usr/bin/env bash
# loop_worker.sh — Seed properties in rotation, infinitely
# Usage: bash scripts/loop_worker.sh

set -euo pipefail

SCRIPTS_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPTS_DIR")"

SEED_FILES=(
  "seed_argentina.ts"
  "seed_argentina2.ts"
  "seed_argentina3.ts"
  "seed_arg_grandes.ts"
  "seed_ciudades2.ts"
  "seed_ciudades3.ts"
  "seed_ciudades4.ts"
  "seed_turisticos.ts"
  "seed_salta_extra.ts"
  "seed_paginacion1.ts"
  "seed_paginacion2.ts"
  "seed_paginacion3.ts"
  "seed_por_tipo1.ts"
  "seed_por_tipo2.ts"
  "seed_villa_maria.ts"
)

idx=0
total=${#SEED_FILES[@]}

echo "[LOOP] Arrancando loop de seeding — $total scripts disponibles"
echo "[LOOP] $(date)"

while true; do
  script="${SEED_FILES[$idx]}"
  echo ""
  echo "[LOOP] =========================================="
  echo "[LOOP] $(date) — Corriendo: $script ($((idx+1))/$total)"
  echo "[LOOP] =========================================="

  cd "$PROJECT_DIR"
  npx tsx "scripts/$script" && echo "[LOOP] ✅ $script OK" || echo "[LOOP] ⚠️  $script falló — continuando"

  idx=$(( (idx + 1) % total ))

  # Pausa entre runs para no quemar MercadoLibre
  echo "[LOOP] Esperando 90 segundos antes del próximo seed..."
  sleep 90
done

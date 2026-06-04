#!/usr/bin/env bash
# ════════════════════════════════════════════════════════════════
# Deployment Verification Script
# Polls the /health endpoint until the app is UP or timeout
# Used in Stage 7 of the Azure DevOps pipeline
# ════════════════════════════════════════════════════════════════

set -euo pipefail

HEALTH_URL="${1:-https://${WEB_APP_NAME}.azurewebsites.net/health}"
MAX_RETRIES=12        # 12 × 15s = 3 minutes max
RETRY_INTERVAL=15     # seconds between attempts
EXPECTED_STATUS="UP"

echo ""
echo "══════════════════════════════════════════════"
echo "  Deployment Verification"
echo "══════════════════════════════════════════════"
echo "  Target URL : $HEALTH_URL"
echo "  Max wait   : $((MAX_RETRIES * RETRY_INTERVAL))s"
echo "══════════════════════════════════════════════"
echo ""

for attempt in $(seq 1 "$MAX_RETRIES"); do
  echo "  [Attempt $attempt/$MAX_RETRIES] Checking health..."

  HTTP_CODE=$(curl -s -o /tmp/health_response.json -w "%{http_code}" \
    --connect-timeout 10 --max-time 20 \
    "$HEALTH_URL" 2>/dev/null || echo "000")

  if [ "$HTTP_CODE" = "200" ]; then
    RESPONSE=$(cat /tmp/health_response.json 2>/dev/null || echo "{}")
    STATUS=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin).get('status',''))" 2>/dev/null || echo "")

    echo "  HTTP $HTTP_CODE | status: $STATUS"
    echo "  Response: $RESPONSE"

    if [ "$STATUS" = "$EXPECTED_STATUS" ]; then
      echo ""
      echo "  ✅ Health check PASSED – application is UP!"
      echo ""
      exit 0
    else
      echo "  ⚠️  Unexpected status value: '$STATUS'"
    fi
  else
    echo "  HTTP $HTTP_CODE – not ready yet"
  fi

  if [ "$attempt" -lt "$MAX_RETRIES" ]; then
    echo "  Waiting ${RETRY_INTERVAL}s before next attempt…"
    sleep "$RETRY_INTERVAL"
  fi
done

echo ""
echo "  ❌ Health check FAILED after $((MAX_RETRIES * RETRY_INTERVAL)) seconds"
echo "     URL: $HEALTH_URL"
echo ""
exit 1

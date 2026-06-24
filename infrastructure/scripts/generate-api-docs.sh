#!/usr/bin/env bash
set -euo pipefail

CONFIG_PATH="infrastructure/ci/docs-config.json"

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required"
  exit 1
fi

spec_output="$(jq -r '.specOutput' "${CONFIG_PATH}")"
site_output="$(jq -r '.siteOutput' "${CONFIG_PATH}")"
version_file="$(jq -r '.versionFile' "${CONFIG_PATH}")"

mkdir -p "$(dirname "${spec_output}")" "${site_output}" "$(dirname "${version_file}")"

version="${1:-$(date +%Y.%m.%d)}"
echo "${version}" > "${version_file}"

# Export real OpenAPI spec from NestJS app
cd Backend
npm run export-spec
cd ..

# Copy YAML output alongside JSON
cp infrastructure/docs/openapi.yaml "$(dirname "${spec_output}")/openapi.yaml"

# Generate minimal static site
cat > "${site_output}/index.html" <<HTMLEOF
<!doctype html>
<html>
  <head><meta charset="utf-8"><title>VertexChain API Docs</title></head>
  <body>
    <h1>VertexChain API Documentation</h1>
    <p>Version: ${version}</p>
    <pre id="spec"></pre>
    <script>
      fetch("../openapi.json").then(r => r.json()).then(d => {
        document.getElementById("spec").textContent = JSON.stringify(d, null, 2);
      });
    </script>
  </body>
</html>
HTMLEOF

echo "Generated API docs for version ${version}"

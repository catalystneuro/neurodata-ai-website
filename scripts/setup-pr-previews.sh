#!/usr/bin/env bash
# One-time setup for PR previews (.github/workflows/preview.yml). Run from a
# machine where `gh` is logged in as an admin of the catalystneuro org. Safe to
# rerun: each step checks whether it has already been done.
#
# It creates a public repository that serves preview builds from GitHub Pages,
# generates a write deploy key for it, and stores the private half as the
# PREVIEW_DEPLOY_KEY secret on the website repository. The key never touches
# disk outside a temporary directory that is deleted at exit.
set -euo pipefail

SITE_REPO="catalystneuro/neurodata-ai-website"
PREVIEW_REPO="catalystneuro/neurodata-ai-website-previews"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

if gh repo view "$PREVIEW_REPO" --json name > /dev/null 2>&1; then
  echo "Repository $PREVIEW_REPO already exists."
else
  gh repo create "$PREVIEW_REPO" --public \
    -d "Per-PR preview builds of neurodata-ai.org. Written by CI; nothing here is edited by hand."
  echo "Created $PREVIEW_REPO."
fi

if gh api "repos/$PREVIEW_REPO/branches/gh-pages" > /dev/null 2>&1; then
  echo "Branch gh-pages already exists."
else
  (
    cd "$TMP"
    git init -q -b gh-pages seed && cd seed
    touch .nojekyll
    printf 'User-agent: *\nDisallow: /\n' > robots.txt
    cat > README.md <<'README'
# neurodata-ai.org PR previews

Preview builds of pull requests to
[catalystneuro/neurodata-ai-website](https://github.com/catalystneuro/neurodata-ai-website).
Each open PR gets a directory `pr-<number>/` on this branch, written by the
"PR preview" workflow in that repository and removed when the PR closes.
Nothing here is edited by hand, and robots.txt asks search engines to stay out.
README
    cat > index.html <<'HTML'
<!doctype html><meta charset="utf-8"><title>neurodata-ai.org PR previews</title>
<p>Preview builds of pull requests to <a href="https://github.com/catalystneuro/neurodata-ai-website">neurodata-ai-website</a>. Each PR links to its own preview from a comment on the PR.</p>
HTML
    git add -A && git commit -q -m "Initialize the previews branch"
    git remote add origin "https://github.com/$PREVIEW_REPO.git"
    git push -q -u origin gh-pages
  )
  echo "Pushed the initial gh-pages branch."
fi

if gh api "repos/$PREVIEW_REPO/pages" > /dev/null 2>&1; then
  echo "GitHub Pages already enabled on $PREVIEW_REPO."
else
  gh api -X POST "repos/$PREVIEW_REPO/pages" -f 'source[branch]=gh-pages' -f 'source[path]=/' > /dev/null
  echo "Enabled GitHub Pages on $PREVIEW_REPO (gh-pages, /)."
fi

KEY_TITLE="neurodata-ai-website PR previews (write)"
if gh repo deploy-key list -R "$PREVIEW_REPO" | grep -q "$KEY_TITLE"; then
  echo "Deploy key already installed; leaving it and the secret alone."
  echo "To rotate, delete the key on $PREVIEW_REPO and rerun this script."
else
  ssh-keygen -q -t ed25519 -N "" -C "$KEY_TITLE" -f "$TMP/key"
  gh repo deploy-key add "$TMP/key.pub" -R "$PREVIEW_REPO" --allow-write --title "$KEY_TITLE"
  gh secret set PREVIEW_DEPLOY_KEY -R "$SITE_REPO" < "$TMP/key"
  echo "Installed the deploy key and set PREVIEW_DEPLOY_KEY on $SITE_REPO."
fi

echo "Done. Previews will appear at https://catalystneuro.github.io/neurodata-ai-website-previews/pr-<number>/"

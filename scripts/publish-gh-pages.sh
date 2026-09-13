#!/usr/bin/env bash
# Publish a built site into the gh-pages branch of this repository.
#
#   publish-gh-pages.sh root <dist>         replace everything except pr-*/ with <dist>
#   publish-gh-pages.sh dir  <name> <dist>  replace <name>/ with <dist>
#   publish-gh-pages.sh remove <name>       delete <name>/
#
# Runs inside GitHub Actions with GH_TOKEN set. Creates the branch on first use,
# keeps a .nojekyll marker so _astro/ is served, and retries the push with a
# rebase if another run got there first.
set -euo pipefail
MODE=$1; NAME=${2:-}; DIST=${3:-}
[ "$MODE" = root ] && { DIST=$NAME; NAME=""; }
REPO_URL="https://x-access-token:${GH_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
WORK=$(mktemp -d)
if git clone -q --branch gh-pages --single-branch --depth 50 "$REPO_URL" "$WORK" 2>/dev/null; then
  :
else
  git init -q "$WORK"
  git -C "$WORK" checkout -q --orphan gh-pages
  git -C "$WORK" remote add origin "$REPO_URL"
fi
cd "$WORK"
git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
case "$MODE" in
  root)
    # Keep preview directories; replace everything else.
    find . -mindepth 1 -maxdepth 1 ! -name .git ! -name 'pr-*' -exec rm -rf {} +
    cp -r "$OLDPWD/$DIST"/. .
    ;;
  dir)
    rm -rf "$NAME"
    cp -r "$OLDPWD/$DIST" "$NAME"
    rm -f "$NAME/CNAME"
    ;;
  remove)
    rm -rf "$NAME"
    ;;
  *) echo "unknown mode $MODE" >&2; exit 2 ;;
esac
touch .nojekyll
git add -A
if git diff --cached --quiet; then echo "Nothing to publish."; exit 0; fi
git commit -q -m "${MODE} ${NAME:-site} from ${GITHUB_SHA:-local}"
for attempt in 1 2 3 4 5; do
  if git push -q origin gh-pages; then echo "Published."; exit 0; fi
  git fetch -q origin gh-pages && git rebase -q origin/gh-pages
done
echo "Could not push after five attempts." >&2
exit 1

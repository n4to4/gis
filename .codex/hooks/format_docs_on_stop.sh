#!/bin/sh

set -eu

if git status --porcelain --untracked-files=all -- src/content/docs | grep -q .; then
  npm run format:docs
fi

#!/bin/bash

git config user.name "Datalocale (via Travis CI with personal access token)"
git config user.email "travis-ci@localhost"

git remote add upstream "https://$GH_TOKEN@github.com/$TRAVIS_REPO_SLUG.git"
git fetch upstream && git reset upstream/$DEPLOY_TARGET_BRANCH

git add -A .
git add -f build/*
git commit -m "build of repo at commit https://github.com/$TRAVIS_REPO_SLUG/tree/$TRAVIS_COMMIT"
git push -q upstream HEAD:$DEPLOY_TARGET_BRANCH

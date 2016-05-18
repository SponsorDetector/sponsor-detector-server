#!/bin/bash
eval "$(ssh-agent -s)"
chmod 600 key
mv key ~/.ssh/id_rsa
cd dist;
pwd;
git init;
git config --global user.name "travis"
git config --global user.email "travis@github.com"
git remote add deploy $DEV_DEPLOY_REPO;
git add .;
git commit -m "Build $TRAVIS_BUILD_NUMBER";
git push deploy master;

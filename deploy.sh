#!/bin/bash
eval "$(ssh-agent -s)"
mv id_rsa ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa
ssh-add ~/.ssh/id_rsa
reload ssh
cd dist;
pwd;
git init;
git config --global user.name "travis"
git config --global user.email "travis@github.com"
git remote add deploy $DEV_DEPLOY_REPO;
git add .;
git commit -m "Build $TRAVIS_BUILD_NUMBER";
git push -f  deploy master --quiet;

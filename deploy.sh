#!/bin/bash
eval "$(ssh-agent -s)"
chmod 600 key
mv id_rsa ~/.ssh/id_rsa
mv id_rsa.pub ~/.ssh/id_rsa.pub
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
git push deploy master;

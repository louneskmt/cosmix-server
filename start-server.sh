#!/bin/bash
cd ./cosmix-server/
echo "Récupération des dernières modifications..."
echo \n
git pull
killall node
echo \n
echo "Démarrage..."
echo \n
node com-test.js

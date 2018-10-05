#!/bin/bash
cd ./cosmix-server/
echo "Récupération des dernières modifications..."
git pull
killall "node com-test.js"
echo "Démarrage...\n"
node com-test.js
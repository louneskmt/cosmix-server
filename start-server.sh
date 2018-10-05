#!/bin/bash
cd ./cosmix-server/
echo "Récupération des dernières modifications..."
git pull
killall node
echo "Démarrage...\n"
node com-test.js
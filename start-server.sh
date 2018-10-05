#!/bin/bash
cd ./cosmix-server/
echo "Récupération des dernières modifications..."
git pull
echo "Démarrage..."
node com-test.js
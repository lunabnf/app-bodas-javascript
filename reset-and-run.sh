#!/bin/bash

echo "Limpiando proyecto actual..."

# Borrar node_modules y archivos lock
rm -rf node_modules
rm -f package-lock.json yarn.lock

echo "Instalando dependencias..."
npm install

echo "Arrancando la aplicación..."
npm run dev

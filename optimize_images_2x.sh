#!/bin/bash

folder="$1"

if [ -z "$folder" ]; then
    echo "Por favor, proporciona la ruta de la carpeta como argumento."
    exit 1
fi

echo "Optimizando JPEGs..."
find "$folder" -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) -exec jpegoptim --strip-all --all-progressive --max=60 {} \;

echo "Optimizando PNGs..."
find "$folder" -type f -iname "*.png" -exec optipng -o7 -strip all {} \;

echo "Optimizando GIFs..."
find "$folder" -type f -iname "*.gif" -exec gifsicle -O3 --colors 64 -o {} {} \;

echo "Optimización completada."

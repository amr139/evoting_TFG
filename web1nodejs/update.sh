#!/bin/sh
folder=${PWD##*/}
cd ..
echo "Comprimiendo" $folder "..."
zip -r $folder.zip ./$folder -q
echo "Subiendo fichero..."
scp $folder.zip ubuntu@192.168.1.138:/home/ubuntu/
echo "Limpiando..."
rm $folder.zip
echo "| FIN |"
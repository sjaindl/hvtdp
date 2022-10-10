#!/bin/bash


# Script

albumId=$1
subFolder=$2
searchDir=$3

if [ -z "$albumId" ]
then
  echo "Provide albumId to of album (1)""
  exit -1
else
  echo "Use album id $albumId""
fi

if [ -z "$subFolder" ]
then
  echo "Provide subfolder of album path (2)""
  exit -1
else
  echo "List files in directory to folder $subFolder""
fi

if [ -z "$searchDir" ]
then
  echo "Provide searchDir to search (3)""
  exit -1
else
  echo "List files in directory $searchDir""
fi
  
for entry in "$searchDir"/*
do
  echo "$albumId;;$subFolder/$entry"
done

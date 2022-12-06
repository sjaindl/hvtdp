#!/bin/bash


# Script

albumId=$1
searchDir=$2

if [ -z "$albumId" ]
then
  echo "Provide albumId to of album (1)""
  exit -1
else
  echo "Use album id $albumId""
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
  echo "$albumId;;gallery/$entry"
done

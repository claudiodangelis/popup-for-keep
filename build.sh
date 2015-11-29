#!/bin/bash
TAG=`git describe --tags`
zip -r "/tmp/popupforkeep-$TAG.zip" src/


#!/bin/bash
function finish {
    cd -
    echo `pwd`
}
trap finish EXIT
TAG=`git describe --tags`
cd src
echo `pwd`
zip -r "/tmp/popupforkeep-$TAG.zip" * -x ts/**\*

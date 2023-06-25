#!/bin/bash

function print_intro() {
    echo "+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-++-+-+-+-+-+-+-+-+"
    echo "Version Information:"
    echo "  Application: HEDWIG CONSOLE API"
    echo "  Environment: $NODE_ENV"
    echo "  NodeJS $(node -v)"
    echo "  NPM $(npm -v)"
    echo "+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-++-+-+-+-+-+-+-+-+"
}

function check() {
    if [ -z ${2+'OK'} ]
    then
        echo -e "\033[31m {{ WARNING }} $1 IS NOT SET! \033[0m"
        exit 1
    fi
}

check "Environment" $NODE_ENV
if [ "$NODE_ENV" == "unit_test" ]
then
    npm test
else
    print_intro
    NODE_ENV=$NODE_ENV node index.js
fi

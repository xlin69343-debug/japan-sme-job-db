#!/bin/zsh
cd "$(dirname "$0")/site"
python3 -m http.server 8899

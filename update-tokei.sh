#!/usr/bin/env bash

BEGIN="<!-- TOKEI-BEGIN -->"
END="<!-- TOKEI-END -->"
FILE="README.md"

code_block="
\`\`\`txt
$(tokei --no-ignore)
\`\`\`
"

sd -A -f s \
    "$BEGIN.*$END" \
    "$BEGIN\n$code_block\n$END" \
    "$FILE"
#!/usr/bin/env bash

update_section() {
    local file=$1
    local marker=$2
    local content=$3

    sd -A -f s \
        "<!-- $marker:BEGIN -->.*<!-- $marker:END -->" \
        "<!-- $marker:BEGIN -->\n$content\n<!-- $marker:END -->" \
        "$file"
}

get_code_block() {
    local output=$1

    cat << EOF
\`\`\`txt
$output
\`\`\`
EOF
}

TOKEI_OUTPUT=$(tokei --no-ignore)
TOKEI_CODE_BLOCK=$(get_code_block "$TOKEI_OUTPUT")
update_section README.md TOKEI "$TOKEI_CODE_BLOCK"

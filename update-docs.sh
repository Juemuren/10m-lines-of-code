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

CODEGEN_BENCHMARK_OUTPUT=$(hyperfine --warmup 2 "node codegen.js 10000000")
CODEGEN_BENCHMARK_CODE_BLOCK=$(get_code_block "$CODEGEN_BENCHMARK_OUTPUT")
update_section README.md CODEGEN-BENCHMARK "$CODEGEN_BENCHMARK_CODE_BLOCK"

PROGRAM_BENCHMARK_OUTPUT=$(node benchmark-output.js)
PROGRAM_BENCHMARK_CODE_BLOCK=$(get_code_block "$PROGRAM_BENCHMARK_OUTPUT")
update_section README.md PROGRAM-BENCHMARK "$PROGRAM_BENCHMARK_CODE_BLOCK"

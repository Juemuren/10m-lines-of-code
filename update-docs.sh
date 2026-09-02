#!/usr/bin/env bash

set -euo pipefail

update_section() {
    local file=$1
    local marker=$2
    local content
    content=$(cat)

    sd -A -f s \
        "<!-- $marker:BEGIN -->.*<!-- $marker:END -->" \
        "<!-- $marker:BEGIN -->\n$content\n<!-- $marker:END -->" \
        "$file"
}

get_code_block() {
    local output
    output=$(cat)

    printf '%s\n' '```txt' "$output" '```'
}

tokei --no-ignore \
    | get_code_block \
    | update_section README.md TOKEI

hyperfine --warmup 2 "node codegen.js 10000000" \
    | get_code_block \
    | update_section README.md CODEGEN-BENCHMARK

node benchmark-output.js \
    | get_code_block \
    | update_section README.md PROGRAM-BENCHMARK

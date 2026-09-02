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

update_tokei() {
    tokei --no-ignore \
        | get_code_block \
        | update_section README.md TOKEI
}

update_codegen_benchmark() {
    hyperfine --warmup 2 "node codegen.js 10000000" \
        | get_code_block \
        | update_section README.md CODEGEN-BENCHMARK
}

update_program_benchmark() {
    node benchmark-output.js \
        | get_code_block \
        | update_section README.md PROGRAM-BENCHMARK
}

update_all() {
    update_tokei
    update_codegen_benchmark
    update_program_benchmark
}

case ${1:-all} in
    all) update_all ;;
    tokei) update_tokei ;;
    codegen-benchmark) update_codegen_benchmark ;;
    program-benchmark) update_program_benchmark ;;
    *) exit 2 ;;
esac

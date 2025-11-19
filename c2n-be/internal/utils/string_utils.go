package utils

import (
	"strings"
)

func CleanHexPrefix(s string) string {
	return strings.TrimPrefix(s, "0x")
}

package utils

import (
	"crypto/ecdsa"
	"encoding/hex"
	"strings"

	"github.com/ethereum/go-ethereum/crypto"
)

func CleanHexPrefix(s string) string {
	return strings.TrimPrefix(s, "0x")
}

func SignData(data string, privateKey *ecdsa.PrivateKey) string {
	hash := crypto.Keccak256Hash([]byte(data))
	signature, err := crypto.Sign(hash.Bytes(), privateKey)
	if err != nil {
		return ""
	}

	signature[64] += 27
	return hex.EncodeToString(signature)
}

package utils

import (
	"crypto/ecdsa"
	"encoding/hex"
	"fmt"
	"strings"

	"github.com/ethereum/go-ethereum/crypto"
)

type CredentialsUtils struct {
	privateKey  string
	networkUrl  string
	credentials *ecdsa.PrivateKey
}

func NewCredentialsUtils(privateKey string, networkUrl string) (*CredentialsUtils, error) {
	privateKey = strings.TrimPrefix(privateKey, "0x")

	privateKeyBytes, err := hex.DecodeString(privateKey)
	if err != nil {
		return nil, fmt.Errorf("failed to decode private key: %v", err)
	}

	ecdsaPrivateKey, err := crypto.ToECDSA(privateKeyBytes)
	if err != nil {
		return nil, fmt.Errorf("failed to convert private key to ECDSA: %v", err)
	}

	return &CredentialsUtils{
		privateKey:  privateKey,
		networkUrl:  networkUrl,
		credentials: ecdsaPrivateKey,
	}, nil
}

func (c *CredentialsUtils) GetSign(hexString string) (string, error) {
	hexString = strings.TrimPrefix(hexString, "0x")

	messageBytes, err := hex.DecodeString(hexString)
	if err != nil {
		return "", fmt.Errorf("failed to decode hex string: %v", err)
	}

	// 计算keccak-256 哈希
	messageHash := crypto.Keccak256(messageBytes)

	// 添加以太坊签名前缀并再次哈希
	prefix := fmt.Sprintf("\x19Ethereum Signed Message:\n%d", len(messageHash))
	prefixedHash := crypto.Keccak256([]byte(prefix), messageHash)

	// 确保 v值为27或28
	signature, err := crypto.Sign(prefixedHash, c.credentials)
	if err != nil {
		return "", fmt.Errorf("failed to sign message: %v", err)
	}

	if signature[64] < 27 {
		signature[64] += 27
	}

	r := signature[:32]
	s := signature[32:64]
	v := signature[64]

	rHex := hex.EncodeToString(r)
	sHex := hex.EncodeToString(s)
	vHex := hex.EncodeToString([]byte{v})

	rHex = fmt.Sprintf("%064s", rHex)
	sHex = fmt.Sprintf("%064s", sHex)
	vHex = fmt.Sprintf("%02s", vHex)

	return rHex + sHex + vHex, nil
}

func (c *CredentialsUtils) GetCredentials() *ecdsa.PrivateKey {
	return c.credentials
}

func (c *CredentialsUtils) GetPrivateKey() string {
	return c.privateKey
}

func (c *CredentialsUtils) GetNetworkUrl() string {
	return c.networkUrl
}

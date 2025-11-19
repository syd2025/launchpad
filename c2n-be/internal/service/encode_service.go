package service

import (
	"c2nbe/internal/utils"
	"errors"
)

type EncodeService interface {
	Sign(hex string) (string, error)
}

type EncodeServiceImpl struct {
	credentials *utils.CredentialsUtils
}

func NewEncodeService(credentials *utils.CredentialsUtils) EncodeService {
	return &EncodeServiceImpl{
		credentials: credentials,
	}
}

func (e *EncodeServiceImpl) Sign(hexString string) (string, error) {
	sign, err := e.credentials.GetSign(hexString)
	if err != nil {
		return "", errors.New("sign error")
	}
	return sign, nil
}

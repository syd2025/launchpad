package svc

import (
	"c2nbe/internal/config"
	"c2nbe/internal/service"
	"c2nbe/internal/utils"
	"crypto/ecdsa"

	"github.com/ethereum/go-ethereum/crypto"
)

type ServiceContext struct {
	Config        config.Config
	EncodeService service.EncodeService
	PrivateKey    *ecdsa.PrivateKey
}

func NewServiceContext(c config.Config) *ServiceContext {
	// 从配置获取私钥和网路URL
	privateKey := c.PrivateKey
	networkUrl := c.NetworkUrl

	// 创建凭证工具类
	credentials, err := utils.NewCredentialsUtils(privateKey, networkUrl)
	if err != nil {
		panic("credentials error")
	}

	// 创建凭证编码服务
	encodeService := service.NewEncodeService(credentials)
	// 从配置中加载私钥
	privateKey_, _ := crypto.HexToECDSA(privateKey)

	return &ServiceContext{
		Config:        c,
		EncodeService: encodeService,
		PrivateKey:    privateKey_,
	}
}

package svc

import (
	"c2nbe/internal/config"
	"c2nbe/internal/service"
	"c2nbe/internal/utils"
)

type ServiceContext struct {
	Config        config.Config
	EncodeService service.EncodeService
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

	return &ServiceContext{
		Config:        c,
		EncodeService: encodeService,
	}
}

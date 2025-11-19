package config

import "github.com/zeromicro/go-zero/rest"

type Config struct {
	rest.RestConf
	PrivateKey string
	NetworkUrl string
}

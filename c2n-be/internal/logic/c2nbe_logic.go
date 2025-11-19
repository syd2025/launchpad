package logic

import (
	"context"
	"strings"

	"c2nbe/internal/svc"
	"c2nbe/internal/types"
	"c2nbe/internal/utils"

	"github.com/zeromicro/go-zero/core/logx"
)

type C2nbeLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewC2nbeLogic(ctx context.Context, svcCtx *svc.ServiceContext) *C2nbeLogic {
	return &C2nbeLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

// 签名注册, 拼接userAddress和contractAddress, 调用签名服务
func (l *C2nbeLogic) SignRegistration(req *types.SignRegistrationRequest) (resp *types.SignRegistrationResponse, err error) {
	if req.UserAddress == "" || req.ContractAddress == "" {
		return &types.SignRegistrationResponse{
			Code:    400,
			Message: "参数错误",
		}, nil
	}

	logx.Info("userAddress = {}, contractAddress = {}", req.UserAddress, req.ContractAddress)

	// 清理地址前缀
	contractAddr := utils.CleanHexPrefix(req.ContractAddress)
	userAddr := utils.CleanHexPrefix(req.UserAddress)

	// 拼接并转换为小写
	concat := strings.ToLower(userAddr + contractAddr)
	hex := "0x" + concat

	// 调用签名服务
	sign, err := l.svcCtx.EncodeService.Sign(hex)
	if err != nil {
		return &types.SignRegistrationResponse{
			Code:    500,
			Message: "sign failed",
		}, nil
	}

	return &types.SignRegistrationResponse{
		Code:    200,
		Message: "sign success",
		Data:    sign,
	}, nil
}

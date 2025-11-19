package logic

import (
	"context"
	"strings"

	"c2nbe/internal/svc"
	"c2nbe/internal/types"
	"c2nbe/internal/utils"

	"github.com/zeromicro/go-zero/core/logx"
)

type SignRegistrationLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewSignRegistrationLogic(ctx context.Context, svcCtx *svc.ServiceContext) *SignRegistrationLogic {
	return &SignRegistrationLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *SignRegistrationLogic) SignRegistration(req *types.SignRegistrationRequest) (resp *types.SignRegistrationResponse, err error) {
	if req.UserAddress == "" || req.ContractAddress == "" {
		return &types.SignRegistrationResponse{
			Code:    400,
			Message: "params error",
		}, nil
	}

	logx.Info("userAddress = {}, contractAddress = {}", req.UserAddress, req.ContractAddress)

	// 清理地址前缀
	contractAddr := utils.CleanHexPrefix(req.ContractAddress)
	userAddr := utils.CleanHexPrefix(req.UserAddress)

	// 拼接并转换小写
	concat := strings.ToLower(userAddr + contractAddr)
	hex := "0x" + concat

	// 调用签名服务
	sign, err := l.svcCtx.EncodeService.Sign(hex)
	if err != nil {
		return &types.SignRegistrationResponse{
			Code:    500,
			Message: "sign error",
		}, nil
	}

	return &types.SignRegistrationResponse{
		Code:    200,
		Message: "success",
		Data:    sign,
	}, nil
}

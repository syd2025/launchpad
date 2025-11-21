package logic

import (
	"context"
	"fmt"
	"math/big"
	"strings"

	"c2nbe/internal/svc"
	"c2nbe/internal/types"
	"c2nbe/internal/utils"

	"github.com/zeromicro/go-zero/core/logx"
)

type SignParticipationLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewSignParticipationLogic(ctx context.Context, svcCtx *svc.ServiceContext) *SignParticipationLogic {
	return &SignParticipationLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *SignParticipationLogic) SignParticipation(req *types.SignParticipationRequest) (resp *types.SignParticipationResponse, err error) {
	if req.UserAddress == "" || req.ContractAddress == "" || req.Amount == "" {
		return &types.SignParticipationResponse{
			Code:    400,
			Message: "params error",
		}, nil
	}

	logx.Info("userAddress = {}, contractAddress = {}, amount = {}", req.UserAddress, req.ContractAddress, req.Amount)

	// 处理地址 - 移除0x前缀
	userAddr := strings.TrimPrefix(req.UserAddress, "0x")
	contractAddr := strings.TrimPrefix(req.ContractAddress, "0x")

	// 金额转换
	amountInt, ok := new(big.Int).SetString(req.Amount, 10)
	if !ok {
		return nil, fmt.Errorf("amount format error")
	}
	amountHex := fmt.Sprintf("%064s", amountInt.Text(16))

	// 拼接数据
	data := strings.ToLower(userAddr + amountHex + contractAddr)
	hexData := "0x" + data

	logx.Infof("hexHexString = %s, userHexAddr = %s", hexData, userAddr)

	return &types.SignParticipationResponse{
		Code:    200,
		Message: "success",
		Data:    utils.SignData(hexData, l.svcCtx.PrivateKey),
	}, nil
}

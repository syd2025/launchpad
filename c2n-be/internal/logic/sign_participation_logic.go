package logic

import (
	"context"

	"c2nbe/internal/svc"
	"c2nbe/internal/types"

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
	// 1.参数验证
	// if strings.TrimSpace(req.UserAddress) == "" || strings.TrimSpace(req.ContractAddress) == "" || strings.TrimSpace(req.Amount) == "" {
	// 	return nil, errors.New("参数错误")
	// }

	// logx.Infof("userAddress=%s, contractAddress=%s, amount=%s", req.UserAddress, req.ContractAddress, req.Amount)

	// // 2. 地址处理
	// userAddr := common.HexToAddress(req.UserAddress).Hex()[2:]
	// contractAddr := common.HexToAddress(req.ContractAddress).Hex()[2:]

	// // 3. 金额转换
	// amountBig, ok := new(big.Int).SetString(req.Amount, 10)
	// if !ok {
	// 	return nil, errors.New("金额转换失败")
	// }

	// amountHex := fmt.Sprintf("%064s", amountBig.Text(16))

	// // 4.拼接数据
	// data := strings.ToLower(userAddr + amountHex + contractAddr)
	// hexData := "0x" + data

	// // 5. 签名
	// hash := crypto.Keccak256Hash([]byte(hexData))
	// signature, err := crypto.Sign(hash.Bytes(), privateKey)
	// if err != nil {
	// 	return nil, errors.New("签名失败")
	// }

	// signature[64] += 27

	// return hexutil.Encode(signature), nil
	return nil, nil
}

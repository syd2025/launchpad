package logic

import (
	"context"

	"c2nbe/internal/svc"
	"c2nbe/internal/types"

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

func (l *C2nbeLogic) C2nbe(req *types.Request) (resp *types.Response, err error) {
	// todo: add your logic here and delete this line

	return
}

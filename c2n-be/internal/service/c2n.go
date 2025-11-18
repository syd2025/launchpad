package service

import (
	"context"

	v1 "c2n-be/api/c2n/v1"
	"c2n-be/internal/biz"
)

// GreeterService is a greeter service.
type C2NService struct {
	v1.UnsafeC2NServer

	cu *biz.C2NUsecase
}

// NewGreeterService new a greeter service.
func NewC2NService(cu *biz.C2NUsecase) *C2NService {
	return &C2NService{cu: cu}
}

// SayHello implements helloworld.GreeterServer.
func (s *C2NService) SignRegistration(ctx context.Context, in *v1.SignRegisterRequest) (*v1.SignRegisterReply, error) {
	g, err := s.cu.CreateC2N(ctx, &biz.C2N{UserAddress: in.UserAddress, ContractAddress: in.ContractAddress})
	if err != nil {
		return nil, err
	}
	return &v1.SignRegisterReply{
		Code: 200,
		Data: g.UserAddress,
	}, nil
}

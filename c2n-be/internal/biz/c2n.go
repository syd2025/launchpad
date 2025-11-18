package biz

import (
	"context"

	v1 "c2n-be/api/c2n/v1"

	"github.com/go-kratos/kratos/v2/errors"
	"github.com/go-kratos/kratos/v2/log"
)

var (
	// ErrUserNotFound is user not found.
	ErrUserNotFound = errors.NotFound(v1.ErrorReason_USER_NOT_FOUND.String(), "user not found")
)

// Greeter is a Greeter model.
type C2N struct {
	UserAddress     string
	ContractAddress string
}

// GreeterRepo is a Greater repo.
type C2NRepo interface {
	SignRegistration(context.Context, *C2N) (*C2N, error)
	// Update(context.Context, *C2N) (*C2N, error)
	// FindByID(context.Context, int64) (*C2N, error)
	// ListByHello(context.Context, string) ([]*C2N, error)
	// ListAll(context.Context) ([]*C2N, error)
}

// GreeterUsecase is a Greeter usecase.
type C2NUsecase struct {
	repo C2NRepo
	log  *log.Helper
}

// NewGreeterUsecase new a Greeter usecase.
func NewC2NUsecase(repo C2NRepo, logger log.Logger) *C2NUsecase {
	return &C2NUsecase{repo: repo, log: log.NewHelper(logger)}
}

// CreateGreeter creates a Greeter, and returns the new Greeter.
func (uc *C2NUsecase) CreateC2N(ctx context.Context, g *C2N) (*C2N, error) {
	uc.log.WithContext(ctx).Infof("CreateGreeter: %v", g.UserAddress)
	return uc.repo.SignRegistration(ctx, g)
}

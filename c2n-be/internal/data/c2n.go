package data

import (
	"context"

	"c2n-be/internal/biz"

	"github.com/go-kratos/kratos/v2/log"
)

type c2nRepo struct {
	data *Data
	log  *log.Helper
}

// NewGreeterRepo .
func NewC2NRepo(data *Data, logger log.Logger) biz.C2NRepo {
	return &c2nRepo{
		data: data,
		log:  log.NewHelper(logger),
	}
}

func (r *c2nRepo) SignRegistration(ctx context.Context, g *biz.C2N) (*biz.C2N, error) {
	return g, nil
}

// func (r *c2nRepo) Update(ctx context.Context, g *biz.C2N) (*biz.C2N, error) {
// 	return g, nil
// }

// func (r *c2nRepo) FindByID(context.Context, int64) (*biz.C2N, error) {
// 	return nil, nil
// }

// func (r *c2nRepo) ListByHello(context.Context, string) ([]*biz.C2N, error) {
// 	return nil, nil
// }

// func (r *c2nRepo) ListAll(context.Context) ([]*biz.C2N, error) {
// 	return nil, nil
// }

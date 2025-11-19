package handler

import (
	"net/http"

	"c2nbe/internal/logic"
	"c2nbe/internal/svc"
	"c2nbe/internal/types"

	"github.com/zeromicro/go-zero/rest/httpx"
)

func SignRegistrationHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.SignRegistrationRequest
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := logic.NewSignRegistrationLogic(r.Context(), svcCtx)
		resp, err := l.SignRegistration(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}

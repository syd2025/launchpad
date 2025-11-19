package handler

import (
	"net/http"

	"c2nbe/internal/logic"
	"c2nbe/internal/svc"
	"c2nbe/internal/types"

	"github.com/zeromicro/go-zero/rest/httpx"
)

func SignParticipationHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.SignParticipationRequest
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := logic.NewSignParticipationLogic(r.Context(), svcCtx)
		resp, err := l.SignParticipation(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}

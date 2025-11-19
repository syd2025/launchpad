### launchpad 借贷平台

该项目主要分为三个部分：

- 合约部分

  1. airdrop 空投合约
  2. farming 合约，将自己的代币质押给 DeFi 平台，获取对应的收益，defi 平台根据用户质押的数量给予相对应的回报

- 前端部分

- 后端部分
  基于 golang（go-zero 框架实现） 的后端服务，主要负责合约的调用，以及数据的存储

```shell
goctl api go -api c2nbe.api --dir . --style go_zero

```

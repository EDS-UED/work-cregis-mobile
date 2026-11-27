/** 通知模板实例 · 来自通知模板表，占位符已填入示例值。 */
export type NotificationLocaleCopy = {
  title: string;
  body: string;
};

export type NotificationExample = {
  id: string;
  templateKey: string;
  category: 'transaction' | 'teamActivity' | 'collaboration' | 'announcement' | 'amlAlert';
  /** Landing Page 可进入时为 true（「不用跳轉」与 N/A 除外）。 */
  canRedirect: boolean;
  copy: Record<'zh-CN' | 'en-US' | 'zh-TW', NotificationLocaleCopy>;
};

export function resolveNotificationCopy(
  copy: NotificationExample['copy'],
  language: string,
): NotificationLocaleCopy {
  if (language === 'en-US' || language.startsWith('en')) {
    return copy['en-US'];
  }
  if (
    language === 'zh-TW' ||
    language === 'zh-Hant' ||
    language.startsWith('zh-TW')
  ) {
    return copy['zh-TW'];
  }
  return copy['zh-CN'];
}

export const NOTIFICATION_EXAMPLES: readonly NotificationExample[] = [
  {
    "id": "9",
    "templateKey": "APPLICATION_PAYMENT_REJECTED",
    "category": "collaboration",
    "canRedirect": true,
    "copy": {
      "zh-CN": {
        "title": "【Quant Inc.】付款申请已驳回",
        "body": "你申请向【Treasury 0x1a2b…5678】付款1,280.50 USDT已被驳回，请知晓。"
      },
      "en-US": {
        "title": "【Quant Inc.】Application for payment has been rejected",
        "body": "Please note that your request for payment of 1,280.50 USDT to [Treasury 0x1a2b…5678] has been rejected."
      },
      "zh-TW": {
        "title": "【Quant Inc.】付款申請已被拒絕",
        "body": "請注意，您向【Treasury 0x1a2b…5678】付款1,280.50 USDT 的申請已被拒絕。"
      }
    }
  },
  {
    "id": "52",
    "templateKey": "PERSONAL_CARD_TRANS_IN",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "充值成功",
        "body": "你的加密卡 Cregis Card 有一笔 1,280.50 USDT 充值已到账,请前往“个人空间-加密卡“查看。"
      },
      "en-US": {
        "title": "Recharge Successful",
        "body": "A recharge of 1,280.50 USDT to your crypto card Cregis Card has been credited,Please go to `Personal Space - Encryption Card` to check."
      },
      "zh-TW": {
        "title": "充值成功",
        "body": "你的加密卡 Cregis Card 有一筆 1,280.50 USDT 充值已到賬,請前往“個人空間-加密卡“查看。"
      }
    }
  },
  {
    "id": "62",
    "templateKey": "TEAM_PROJECT_ENABLE_OPERATE_NOTICE",
    "category": "teamActivity",
    "canRedirect": true,
    "copy": {
      "zh-CN": {
        "title": "项目禁用/启用通知",
        "body": "您所在团队【Quant Inc.】项目【Payment Engine】已被启用，请登录客户端前往“项目”中查看处理。"
      },
      "en-US": {
        "title": "Project Disable/Enable Notification",
        "body": "Your team 【Quant Inc.】project 【Payment Engine】 has been Enable. Please log in to client and go to 'Projects' to view it."
      },
      "zh-TW": {
        "title": "项目禁用/啓用通知",
        "body": "您所在團隊【Quant Inc.】項目【Payment Engine】已被啟用，請登錄客戶端前往“專案”中查看處理。"
      }
    }
  },
  {
    "id": "68",
    "templateKey": "AML_RISK_ALERTS",
    "category": "amlAlert",
    "canRedirect": true,
    "copy": {
      "zh-CN": {
        "title": "AML风险警报",
        "body": "收款交易【0x8f3a…c21d】被Cregis AML标记为危险交易。为了您的资金和地址安全，该收款地址已被禁用，请及时查看处理。"
      },
      "en-US": {
        "title": "AML Risk Alert",
        "body": "The incoming transaction [0x8f3a…c21d] has been flagged as a dangerous transaction by Cregis AML. For the safety of your funds and address, the receiving address has been disabled. Please review and address this promptly."
      },
      "zh-TW": {
        "title": "AML風險警報",
        "body": "收款交易【txId】被Cregis AML標記為危險交易。為了您的資金和地址安全，該收款地址已被禁用，請及時查看處理。"
      }
    }
  },
  {
    "id": "71",
    "templateKey": "KYB_AUDIT_PASS",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "企业认证通过",
        "body": "团队【Quant Inc.】已通过企业认证"
      },
      "en-US": {
        "title": "Enterprise Verification Approved",
        "body": "Team 【Quant Inc.】 has passed enterprise verification"
      },
      "zh-TW": {
        "title": "企業認證通過",
        "body": "團隊【Quant Inc.】已通過企業認證"
      }
    }
  },
  {
    "id": "75",
    "templateKey": "AUTO_RENEW_BALANCE_INSUFFICIENT_REMIND",
    "category": "teamActivity",
    "canRedirect": true,
    "copy": {
      "zh-CN": {
        "title": "余额不足，自动续费可能失败",
        "body": "【Quant Inc.】团队内已开启自动续费的订阅即将到期。但当前余额不足以支付7天内到期的所有项目，系统自动扣款可能失败，请立即充值。"
      },
      "en-US": {
        "title": "Insufficient balance, auto-renewal may fail.",
        "body": "The subscriptions with auto-renewal enabled in team [Quant Inc.] are about to expire. However, the current balance is insufficient to pay for all items due within 7 days. The system's automatic charge may fail. Please top up immediately."
      },
      "zh-TW": {
        "title": "餘額不足，自動續費可能失敗",
        "body": "【Quant Inc.】團隊內已開啟自動續費的訂閱即將到期。但當前餘額不足以支付7天內到期的所有項目，系統自動扣款可能失敗，請立即充值。"
      }
    }
  },
  {
    "id": "77",
    "templateKey": "UBS_PACKAGE_EQUITY_AUTO_RENEW_SUCCESS",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "团队订阅项目自动续费成功",
        "body": "您的团队【Quant Inc.】的订阅【Business】已通过自动续费成功延期。"
      },
      "en-US": {
        "title": "Auto-Renewal Failed for Your Team’s Subscription",
        "body": "The subscription for [Business] under your team [Quant Inc.] has been successfully renewed via automatic payment."
      },
      "zh-TW": {
        "title": "團隊訂閱項目自動續費失敗",
        "body": "您的團隊【Quant Inc.】的訂閱【Business】已透過自動續費成功延期。"
      }
    }
  },
  {
    "id": "10",
    "templateKey": "PAYMENT_REQUEST",
    "category": "collaboration",
    "canRedirect": true,
    "copy": {
      "zh-CN": {
        "title": "【Quant Inc.】付款申请",
        "body": "Alex发起一笔付款申请,请审批/签名。"
      },
      "en-US": {
        "title": "【Quant Inc.】Payment request",
        "body": "Alex initiated a payment request, please approve/sign."
      },
      "zh-TW": {
        "title": "【Quant Inc.】付款請求",
        "body": "Alex發起一筆付款申請，請審批/簽名。"
      }
    }
  },
  {
    "id": "17",
    "templateKey": "BATCH_APPLICATION_PAYMENT_REJECTED",
    "category": "collaboration",
    "canRedirect": true,
    "copy": {
      "zh-CN": {
        "title": "【Quant Inc.】批量付款申请已驳回",
        "body": "你发起的一笔批量付款申请已被驳回，请知晓。"
      },
      "en-US": {
        "title": "【Quant Inc.】Batch Application for payment has been rejected",
        "body": "Your batch payment request has been rejected, please be aware."
      },
      "zh-TW": {
        "title": "【Quant Inc.】批量付款申請已駁回",
        "body": "你發起的一筆批量付款申請已被駁回，請知曉。"
      }
    }
  },
  {
    "id": "18",
    "templateKey": "BATCH_PAYMENT_APPLICATION_APPROVED",
    "category": "collaboration",
    "canRedirect": true,
    "copy": {
      "zh-CN": {
        "title": "【Quant Inc.】批量付款申请已通过",
        "body": "你发起的一笔批量付款申请已通过，请知晓。"
      },
      "en-US": {
        "title": "【Quant Inc.】Batch payment request has been approved",
        "body": "The batch payment request you initiated has been approved, please be informed."
      },
      "zh-TW": {
        "title": "【Quant Inc.】批量付款申請已通過",
        "body": "你發起的一筆批量付款申請已通過，請知曉。"
      }
    }
  },
  {
    "id": "20",
    "templateKey": "CARD_STATUS_FROZEN",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "加密卡冻结",
        "body": "你的加密卡 Cregis Card 被管理员冻结"
      },
      "en-US": {
        "title": "Crypto Card Frozen",
        "body": "Your crypto card Cregis Card has been frozenby the administrator."
      },
      "zh-TW": {
        "title": "加密卡凍結",
        "body": "你的加密卡 Cregis Card 被管理員凍結"
      }
    }
  },
  {
    "id": "42",
    "templateKey": "AUTO_TASK_ERROR_BALANCE",
    "category": "teamActivity",
    "canRedirect": true,
    "copy": {
      "zh-CN": {
        "title": "自动签名失败提醒",
        "body": "您所在的团队 Quant Inc. 开启的自动签名规则 Auto Sign，钱包 USDT 默认付款地址余额不足。请立即前往钱包充值，确保自动签名正常运作。"
      },
      "en-US": {
        "title": "Automatic Signing Failure Alert",
        "body": "Your team Quant Inc. has activated the auto-signature rule Auto Sign, but the default payment address for wallet USDT has insufficient balance. Please top up the wallet immediately to ensure the auto-signature functions properly."
      },
      "zh-TW": {
        "title": "自動簽名失敗提醒",
        "body": "您所在的團隊 Quant Inc. 開啓的自動簽名規則 Auto Sign，錢包 USDT 默認付款地址餘額不足。請立即前往錢包充值，確保自動簽名正常運作。"
      }
    }
  },
  {
    "id": "47",
    "templateKey": "CARD_TRANS_CREDIT",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "退款通知",
        "body": "你的加密卡 Cregis Card 有一笔 1,280.50 USDT 退款已到账"
      },
      "en-US": {
        "title": "Refund Notification",
        "body": "A refund of 1,280.50 USDT to your crypto card Cregis Card has been credited."
      },
      "zh-TW": {
        "title": "退款通知",
        "body": "你的加密卡 Cregis Card 有一筆 1,280.50 USDT 退款已到賬"
      }
    }
  },
  {
    "id": "55",
    "templateKey": "CARD_TRANS_STATUS_CHANGE_SUCCESS_V2",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "加密卡交易成功",
        "body": "团队 Quant Inc. 的加密卡 Cregis Card 有一笔1,280.50 USDT订单交易成功。"
      },
      "en-US": {
        "title": "Crypto Card Transacted Successfully",
        "body": "Quant Inc. - Cregis Card has transacted 1,280.50 USDT."
      },
      "zh-TW": {
        "title": "加密卡交易成功",
        "body": "團隊 Quant Inc. 的加密卡 Cregis Card 一筆1,280.50 USDT訂單交易成功。"
      }
    }
  },
  {
    "id": "65",
    "templateKey": "TEAM_PROJECT_DISABLE_OPERATE_NOTICE",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "项目禁用/启用通知",
        "body": "您所在团队【Quant Inc.】项目【Payment Engine】已被禁用，请登录客户端前往“项目”中查看处理。"
      },
      "en-US": {
        "title": "Project Disable/Enable Notification",
        "body": "Your team 【Quant Inc.】project 【Payment Engine】 has been Disable. Please log in to client and go to 'Projects' to view it."
      },
      "zh-TW": {
        "title": "项目禁用/啓用通知",
        "body": "您所在團隊【Quant Inc.】項目【Payment Engine】已被禁用，請登錄客戶端前往“專案”中查看處理。"
      }
    }
  },
  {
    "id": "80",
    "templateKey": "WAAS_TRANSFER_TEAM_BALANCE_INSUFFICIENT",
    "category": "teamActivity",
    "canRedirect": true,
    "copy": {
      "zh-CN": {
        "title": "订单待转账提醒",
        "body": "你团队的账户余额不足以支付（WaaS 订单模式项目：Payment Engine） 12 笔的 86.40 USD 的服务费。请对团队账户进行充值，以继续转账流程。在此期间，订单仍可以继续收款，不会影响 贵司的收款业务。"
      },
      "en-US": {
        "title": "Pending Transfer Reminder",
        "body": "Your team account balance is insufficient to cover the service fees for 12 orders from the WaaS order mode project, Payment Engine (Total Service Fee: 86.40 USD). Please top up your team account to continue the transfer process. During this time, your new orders can still receive payments, so this pending settlement will not affect your company’s operations."
      },
      "zh-TW": {
        "title": "訂單待轉賬提醒",
        "body": "你團隊的帳戶餘額不足以支付（WaaS 訂單模式項目：Payment Engine） 12 筆的 86.40 USD 的服務費。請對團隊帳戶進行充值，以繼續轉賬流程。在此期間，訂單仍可以繼續收款，不會影響 貴司的收款業務。"
      }
    }
  },
  {
    "id": "5",
    "templateKey": "TEAM_INVITATION",
    "category": "teamActivity",
    "canRedirect": true,
    "copy": {
      "zh-CN": {
        "title": "团队邀请",
        "body": "Alex 邀请您加入团队 Quant Inc."
      },
      "en-US": {
        "title": "Team invitation",
        "body": "Alex Invite you to join the team Quant Inc."
      },
      "zh-TW": {
        "title": "團隊邀請",
        "body": "Alex 邀請您加入團隊 Quant Inc."
      }
    }
  },
  {
    "id": "35",
    "templateKey": "CARD_REPLACE_SHIP_FAIL",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "收货信息校验不通过",
        "body": "你的加密卡 Cregis Card 补卡申请，收货信息校验不通过，请尽快前往“加密卡-补卡申请”修改并重新提交"
      },
      "en-US": {
        "title": "Delivery information verification failed",
        "body": "The delivery information in the card replacement application for your card Cregis Card failed to pass the verification. Please go to Crypto Card-Card Replacement Application to edit and resubmit your information as soon as possible."
      },
      "zh-TW": {
        "title": "收貨資訊校驗不透過",
        "body": "你的加密卡 Cregis Card 補卡申請，收貨資讯校驗不透過，請儘快前往“加密卡-補卡申請“修改並重新提交"
      }
    }
  },
  {
    "id": "37",
    "templateKey": "PERSONAL_CARD_CREATE_RESULT",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "开卡成功",
        "body": "你申请创建的加密卡 Cregis Card 开卡成功。"
      },
      "en-US": {
        "title": "开卡成功",
        "body": "The encryption card Cregis Card you applied to create 开卡成功."
      },
      "zh-TW": {
        "title": "开卡成功",
        "body": "你申請建立的加密卡 Cregis Card 开卡成功。"
      }
    }
  },
  {
    "id": "38",
    "templateKey": "TEAM_KYB_AUTH_FAIL",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "企业认证失败",
        "body": "你所在团队 Quant Inc. 企业认证失败，失败原因: 材料不完整"
      },
      "en-US": {
        "title": "KYB Failed",
        "body": "Please be aware that KYB for your team Quant Inc. has failed. Reason for failure: 材料不完整"
      },
      "zh-TW": {
        "title": "企業認證失敗",
        "body": "你所在團隊 Quant Inc. 企業認證失敗，失敗原因: 材料不完整"
      }
    }
  },
  {
    "id": "44",
    "templateKey": "AUTO_TASK_ERROR_GAS_FEE_COLLECT",
    "category": "teamActivity",
    "canRedirect": true,
    "copy": {
      "zh-CN": {
        "title": "自动归集失败提醒",
        "body": "您所在的团队 Quant Inc. 开启的自动归集规则 Auto Sign，钱包 USDT 默认付款地址矿工费不足。请立即前往钱包充值，确保自动归集正常运作。"
      },
      "en-US": {
        "title": "Automatic Collection Failure Alert",
        "body": "Your team Quant Inc. has activated the auto-collection rule Auto Sign, but the default payment address for wallet USDT has insufficient gas fees. Please top up the wallet immediately to ensure the auto-collection functions properly."
      },
      "zh-TW": {
        "title": "自動歸集失敗提醒",
        "body": "您所在的團隊 Quant Inc. 開啓的自動歸集規則 Auto Sign，錢包 USDT 默認付款地址礦工費不足。請立即前往錢包充值，確保自動歸集正常運作。"
      }
    }
  },
  {
    "id": "66",
    "templateKey": "AML_AUTOMATIC_QUERY_FAILED_CANNOT_BE_PROCESSED",
    "category": "amlAlert",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "AML自动查询失败-无法处理",
        "body": "由于客户端或服务器错误，收款交易【0x8f3a…c21d】AML自动查询失败，本次查询费用已退还至团队余额。如需查询该笔交易，请联系支持团队。"
      },
      "en-US": {
        "title": "AML Auto Query Failed - Unable to Process",
        "body": "Due to a client or server error, the AML auto query for the incoming transaction [0x8f3a…c21d] failed. The query fee has been refunded to the team balance. To query this transaction, please contact the support team."
      },
      "zh-TW": {
        "title": "AML自動查詢失敗-無法處理",
        "body": "由於客戶端或伺服器錯誤，收款交易【0x8f3a…c21d】AML自動查詢失敗，本次查詢費用已退還至團隊餘額。如需查詢該筆交易，請聯繫支持團隊。"
      }
    }
  },
  {
    "id": "2",
    "templateKey": "JOIN_WALLET",
    "category": "teamActivity",
    "canRedirect": true,
    "copy": {
      "zh-CN": {
        "title": "加入钱包",
        "body": "您已加入钱包 Quant Vault, 请知晓"
      },
      "en-US": {
        "title": "Add to wallet",
        "body": "You have joined wallet Quant Vault, please know"
      },
      "zh-TW": {
        "title": "加入錢包",
        "body": "您已加入錢包 Quant Vault, 請知曉"
      }
    }
  },
  {
    "id": "40",
    "templateKey": "CARD_TRANS_STATUS_CHANGE",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "加密卡订单交易失败",
        "body": "你的加密卡 Cregis Card 有一笔 1,280.50 USDT 订单交易失败"
      },
      "en-US": {
        "title": "Crypto Card Transaction Failed",
        "body": "Transaction with the 1,280.50 USDT on your crypto card Cregis Card was Failed."
      },
      "zh-TW": {
        "title": "加密卡訂單交易失敗",
        "body": "你的加密卡 Cregis Card 有一筆 1,280.50 USDT 訂單交易失敗"
      }
    }
  },
  {
    "id": "46",
    "templateKey": "TEAM_CARD_SEND_USER",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "团队Quant Inc.的 Cregis 加密实体卡Cregis Card已寄出",
        "body": "请收到实体卡后，凭信内的激活码尽快激活实体卡。"
      },
      "en-US": {
        "title": "Quant Inc. - Cregis Card Cregis Crypto Physical Card is shipped",
        "body": "Please activate your physical with the activation code attached in the mail."
      },
      "zh-TW": {
        "title": "團隊Quant Inc.的 Cregis 加密實體卡Cregis Card已寄出",
        "body": "請收到實體卡後，憑信內的激活碼儘快激活實體卡。"
      }
    }
  },
  {
    "id": "53",
    "templateKey": "PERSONAL_CARD_TRANS_STATUS_CHANGE_FAIL",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "加密卡订单交易失败",
        "body": "你的加密卡 Cregis Card 有一笔 1,280.50 USDT 订单交易失败，请前往“个人空间-加密卡“查看。"
      },
      "en-US": {
        "title": "Crypto Card Transaction Failed",
        "body": "Transaction with the 1,280.50 USDT on your crypto card Cregis Card was Failed. Please go to `Personal Space - Encryption Card` to check."
      },
      "zh-TW": {
        "title": "加密卡訂單交易失敗",
        "body": "你的加密卡 Cregis Card 有一筆 1,280.50 USDT 訂單交易失敗，請前往“個人空間-加密卡“查看。"
      }
    }
  },
  {
    "id": "54",
    "templateKey": "PERSONAL_CARD_TRANS_STATUS_CHANGE_SUCCESS",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "加密卡交易成功",
        "body": "你的加密卡Cregis Card有一笔1,280.50 USDT订单交易成功。"
      },
      "en-US": {
        "title": "Crypto Card Transacted Successfully",
        "body": "Your Cregis Card has transacted 1,280.50 USDT."
      },
      "zh-TW": {
        "title": "加密卡交易成功",
        "body": "你的加密卡Cregis Card有一筆1,280.50 USDT訂單交易成功。"
      }
    }
  },
  {
    "id": "4",
    "templateKey": "JOIN_TEAM",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "加入团队",
        "body": "Alex 加入了团队 Quant Inc."
      },
      "en-US": {
        "title": "Join the team",
        "body": "Alex joined the team Quant Inc."
      },
      "zh-TW": {
        "title": "加入團隊",
        "body": "Alex 加入了團隊 Quant Inc."
      }
    }
  },
  {
    "id": "19",
    "templateKey": "CARD_CREATE_SUCCESS",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "开卡成功",
        "body": "Alex 为你创建了加密卡 Cregis Card"
      },
      "en-US": {
        "title": "Card Activation Successful",
        "body": "Alex has created a crypto card Cregis Card for you."
      },
      "zh-TW": {
        "title": "開卡成功",
        "body": "Alex 為你建立了加密卡 Cregis Card"
      }
    }
  },
  {
    "id": "26",
    "templateKey": "PERSONAL_CARD_STATUS_FROZEN",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "加密卡冻结",
        "body": "你的加密卡 Cregis Card 已被冻结，请前往 `个人空间-加密卡` 查看。"
      },
      "en-US": {
        "title": "Crypto Card Frozen",
        "body": "Your crypto card Cregis Card has been frozen，Please go to `Personal Space - Encryption Card` to view"
      },
      "zh-TW": {
        "title": "加密卡凍結",
        "body": "你的加密卡 Cregis Card 已被凍結，請前往 `個人空間-加密卡` 檢視。"
      }
    }
  },
  {
    "id": "57",
    "templateKey": "TEAM_PROJECT_PAYMENT_API_KEY_NOTICE",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "支付引擎API Key 重置通知",
        "body": "您的团队【Quant Inc.】支付引擎 【Payment Engine】 API Key 已被重置，请登录客户端前往“支付引擎-设置-开发者”中查看处理。"
      },
      "en-US": {
        "title": "Payment Engine API Key Reset Notification",
        "body": "Your team 【Quant Inc.】's Payment Engine 【Payment Engine】API Key has been reset. Please log in to Cregis and go to Payment Engine -Settings-Developer to view the details."
      },
      "zh-TW": {
        "title": "支付引擎API Key 重置通知",
        "body": "您的團隊【Quant Inc.】支付引擎 【Payment Engine】API Key 已被重置，請登錄客户端前往“支付引擎-設置-開發者”中查看處理。"
      }
    }
  },
  {
    "id": "63",
    "templateKey": "TEAM_PROJECT_PAYMENT_ENABLE_OPERATE_NOTICE",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "支付引擎禁用/启用通知",
        "body": "您的团队【Quant Inc.】支付引擎【Payment Engine】已被启用，请登录客户端前往“支付引擎”中查看处理。"
      },
      "en-US": {
        "title": "Payment Engine Disable/Enable Notification",
        "body": "Your team 【Quant Inc.】's Payment Engine 【Payment Engine】 has been Enable. Please log in to Cregis and go to 'Payment Engine' to view the details."
      },
      "zh-TW": {
        "title": "支付引擎禁用/啓用通知",
        "body": "您的團隊【Quant Inc.】支付引擎【Payment Engine】已被啟用，請登錄客戶端前往“支付引擎”中查看處理。"
      }
    }
  },
  {
    "id": "64",
    "templateKey": "TEAM_PROJECT_PAYMENT_DISABLE_OPERATE_NOTICE",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "支付引擎禁用/启用通知",
        "body": "您的团队【Quant Inc.】支付引擎【Payment Engine】已被禁用，请登录客户端前往“支付引擎”中查看处理。"
      },
      "en-US": {
        "title": "Payment Engine Disable/Enable Notification",
        "body": "Your team 【Quant Inc.】's Payment Engine 【Payment Engine】 has been Disable. Please log in to Cregis and go to 'Payment Engine' to view the details."
      },
      "zh-TW": {
        "title": "支付引擎禁用/啓用通知",
        "body": "您的團隊【Quant Inc.】支付引擎【Payment Engine】已被禁用，請登錄客戶端前往“支付引擎”中查看處理。"
      }
    }
  },
  {
    "id": "67",
    "templateKey": "AML_AUTOMATIC_QUERY_FAILED_INSUFFICIENT_BALANCE",
    "category": "amlAlert",
    "canRedirect": true,
    "copy": {
      "zh-CN": {
        "title": "AML自动查询失败-余额不足",
        "body": "由于团队账户余额不足，收款交易【0x8f3a…c21d】AML自动查询失败。如需查询该笔交易，请联系支持团队。"
      },
      "en-US": {
        "title": "AML Auto Query Failed - Insufficient Balance",
        "body": "Due to insufficient team account balance, the AML auto query for the incoming transaction [0x8f3a…c21d] failed. To query this transaction, please contact the support team."
      },
      "zh-TW": {
        "title": "AML自動查詢失敗-餘額不足",
        "body": "由於團隊帳戶餘額不足，收款交易【0x8f3a…c21d】AML自動查詢失敗。如需查詢該筆交易，請聯繫支持團隊。"
      }
    }
  },
  {
    "id": "11",
    "templateKey": "TRANSACTION_SENT_SUCCESSFULLY",
    "category": "transaction",
    "canRedirect": true,
    "copy": {
      "zh-CN": {
        "title": "USDT:发送成功 -1,280.50",
        "body": "发送方:Treasury 0x1a2b…5678 \n接收方:Ops 0x9876…5432 \n所属团队:Quant Inc. \n所属钱包:Quant Vault"
      },
      "en-US": {
        "title": "USDT: send successfully  -1,280.50",
        "body": "Sender: 0x1a2b…5678 Treasury\nReceiver: 0x9876…5432 Ops\nTeam: Quant Inc.\nWallet: Quant Vault"
      },
      "zh-TW": {
        "title": "USDT:發送成功 -1,280.50",
        "body": "發送方:0x1a2b…5678 Treasury \n接收方:0x9876…5432 Ops \n所屬團隊:Quant Inc. \n所屬錢包:Quant Vault"
      }
    }
  },
  {
    "id": "13",
    "templateKey": "WITHDRAW_WAIT_SIGN_DATA",
    "category": "collaboration",
    "canRedirect": true,
    "copy": {
      "zh-CN": {
        "title": "【Quant Inc.】提币申请",
        "body": "项目 Payment Engine 发起一笔提币,请审批/签名。"
      },
      "en-US": {
        "title": "【Quant Inc.】Cash withdrawal application",
        "body": "Project Payment Engine initiated a withdrawal of currency, please approve/sign."
      },
      "zh-TW": {
        "title": "【Quant Inc.】提幣申請",
        "body": "項目Payment Engine發起一筆提幣，請審批/簽名。"
      }
    }
  },
  {
    "id": "28",
    "templateKey": "USER_KYC_AUTH_SUCCESS",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "实名认证通过",
        "body": "你提交的实名认证已通过，请知晓。"
      },
      "en-US": {
        "title": "KYC Approved",
        "body": "Please be aware that your KYC has been approved."
      },
      "zh-TW": {
        "title": "實名認證通過",
        "body": "你提交的實名認證已通過，請知曉"
      }
    }
  },
  {
    "id": "36",
    "templateKey": "PERSONAL_CARD_CREATE_RESULT_FAIL",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "开卡失败",
        "body": "你申请创建的加密卡 Cregis Card 开卡失败。"
      },
      "en-US": {
        "title": "Card Application Failed",
        "body": "The encryption card Cregis Card you applied to create Failed."
      },
      "zh-TW": {
        "title": "開卡失敗",
        "body": "你申請建立的加密卡 Cregis Card 開卡失敗。"
      }
    }
  },
  {
    "id": "43",
    "templateKey": "AUTO_TASK_ERROR_GAS_FEE_SIGN",
    "category": "teamActivity",
    "canRedirect": true,
    "copy": {
      "zh-CN": {
        "title": "自动签名失败提醒",
        "body": "您所在的团队 Quant Inc. 开启的自动签名规则 Auto Sign，钱包 USDT 默认付款地址矿工费不足。请立即前往钱包充值，确保自动签名正常运作。"
      },
      "en-US": {
        "title": "Automatic Signing Failure Alert",
        "body": "Your team Quant Inc. has activated the auto-signature rule Auto Sign, but the default payment address for wallet USDT has insufficient gas fees. Please top up the wallet immediately to ensure the auto-signature functions properly."
      },
      "zh-TW": {
        "title": "自動簽名失敗提醒",
        "body": "您所在的團隊 Quant Inc. 開啓的自動簽名規則 Auto Sign，錢包 USDT 默認付款地址礦工費不足。請立即前往錢包充值，確保自動簽名正常運作。"
      }
    }
  },
  {
    "id": "51",
    "templateKey": "PERSONAL_CARD_TRANS_CREDIT",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "退款通知",
        "body": "你的加密卡 Cregis Card 有一笔 1,280.50 USDT 退款已到账,请前往“个人空间-加密卡“查看。"
      },
      "en-US": {
        "title": "Refund Notification",
        "body": "A refund of 1,280.50 USDT to your crypto card Cregis Card has been credited. Please go to `Personal Space - Encryption Card` to check."
      },
      "zh-TW": {
        "title": "退款通知",
        "body": "你的加密卡 Cregis Card 有一筆 1,280.50 USDT 退款已到賬,請前往“個人空間-加密卡“查看."
      }
    }
  },
  {
    "id": "60",
    "templateKey": "TEAM_PROJECT_API_KEY_NOTICE",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "API Key 重置通知",
        "body": "您所在团队【Quant Inc.】项目【Payment Engine】 API Key 已被重置，请登录客户端前往“项目-项目管理-开发者”中查看处理。"
      },
      "en-US": {
        "title": "API Key Reset Notification",
        "body": "Your team【Quant Inc.】project【Payment Engine】API Key has been reset. Please log in to client and go to 'Projects - Project Management - Developer' to review and handle it."
      },
      "zh-TW": {
        "title": "API Key 重置通知",
        "body": "您所在團隊【Quant Inc.】項目【Payment Engine】 API Key 已被重置，請登錄客戶端前往“專案 - 專案管理 - 開發者”中查看處理。"
      }
    }
  },
  {
    "id": "70",
    "templateKey": "KYB_TIMEOUT",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "认证超时",
        "body": "由于您未能在30天内填写完成并提交认证表单，您的认证已超时。如需继续完成认证，请联系Cregis支持团队。"
      },
      "en-US": {
        "title": "Verification Timeout",
        "body": "Because you did not complete and submit the verification form within 30 days, your verification has timed out. If you wish to complete verification, please contact the Cregis Support Team."
      },
      "zh-TW": {
        "title": "認證超時",
        "body": "由於您未能在 30 天內填寫完成並提交認證表單，您的認證已超時。如需繼續完成認證，請聯繫 Cregis 支援團隊。"
      }
    }
  },
  {
    "id": "74",
    "templateKey": "AUTO_RENEW_OFF_REMIND",
    "category": "teamActivity",
    "canRedirect": true,
    "copy": {
      "zh-CN": {
        "title": "订阅即将到期，请及时续费",
        "body": "您团队【Quant Inc.】的有订阅项目即将到期，当中包含未开启自动续费的项目，为避免服务中断，请尽快手动完成续费。"
      },
      "en-US": {
        "title": "Subscription expiring soon, please renew promptly.",
        "body": "Your team [Quant Inc.] has subscription items that are about to expire, including some that do not have auto-renewal enabled. To avoid service disruption, please manually complete the renewal as soon as possible."
      },
      "zh-TW": {
        "title": "訂閱即將到期，請及時續費",
        "body": "您團隊【Quant Inc.】的訂閱項目即將到期，當中包含未開啟自動續費的項目，為避免服務中斷，請儘快手動完成續費。"
      }
    }
  },
  {
    "id": "79",
    "templateKey": "UBS_EQUITY_AML_SUBSCRIPTION_INSUFFICIENT_EMAIL_NOTICE",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "当前可用AML次数即将用尽",
        "body": "团队【Quant Inc.】可用AML次数少于5次，次数用尽后，系统将根据您团队订阅的折扣价单次购买次数，并从团队账户余额中扣款。"
      },
      "en-US": {
        "title": "The available AML attempts are about to run out",
        "body": "The team 【Quant Inc.】 currently has fewer than 5 AML attempts remaining. Once the quota is exhausted, the system will purchase additional attempts at the discounted price based on your team's subscription, and the cost will be deducted from the team account balance."
      },
      "zh-TW": {
        "title": "當前可用AML次數即將用盡",
        "body": "團隊【Quant Inc.】可用AML次數少於5次，次數用盡後，系統將根據您團隊訂閱的折扣價單次購買次數，並從團隊帳戶餘額中扣款。"
      }
    }
  },
  {
    "id": "8",
    "templateKey": "PAYMENT_APPLICATION_APPROVED",
    "category": "collaboration",
    "canRedirect": true,
    "copy": {
      "zh-CN": {
        "title": "【Quant Inc.】付款申请通过",
        "body": "你申请向【Treasury 0x1a2b…5678】付款1,280.50 USDT已通过，请知晓。"
      },
      "en-US": {
        "title": "【Quant Inc.】Payment application approved",
        "body": "Please note that your application for payment of 1,280.50 USDT to [Treasury 0x1a2b…5678] has been approved."
      },
      "zh-TW": {
        "title": "【Quant Inc.】付款申請已批准",
        "body": "请注意，您的向【Treasury 0x1a2b…5678】付款1,280.50 USDT 的申请已被批准。"
      }
    }
  },
  {
    "id": "21",
    "templateKey": "CARD_STATUS_ACTIVE",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "加密卡解冻",
        "body": "管理员已将你的加密卡 Cregis Card 解除冻结"
      },
      "en-US": {
        "title": "Crypto Card Unfrozen",
        "body": "The administrator has unfrozen your crypto card Cregis Card"
      },
      "zh-TW": {
        "title": "加密卡解凍",
        "body": "管理員已將你的加密卡 Cregis Card 解除凍結"
      }
    }
  },
  {
    "id": "33",
    "templateKey": "TEAM_KYB_AUTH_SUCCESS",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "企业认证通过",
        "body": "你所在团队 Quant Inc. 企业认证通过，请知晓。"
      },
      "en-US": {
        "title": "KYB Approved",
        "body": "Please be aware that KYB for your team Quant Inc. has been approved"
      },
      "zh-TW": {
        "title": "企業認證通過",
        "body": "你所在團隊 Quant Inc. 企業認證通過，請知曉."
      }
    }
  },
  {
    "id": "34",
    "templateKey": "CARD_SHIP_FAIL",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "收货信息校验不通过",
        "body": "你创建的加密卡 Cregis Card，收货信息校验不通过，请尽快修改并重新提交"
      },
      "en-US": {
        "title": "Delivery information verification failed",
        "body": "The delivery information for your crypto card Cregis Card failed to pass the verification. Please edit andresubmit your information as soon as possible."
      },
      "zh-TW": {
        "title": "收貨資訊校驗不透過",
        "body": "你建立的加密卡 Cregis Card，收貨資讯校驗不透過，请儘快修改业重新提交。"
      }
    }
  },
  {
    "id": "48",
    "templateKey": "CARD_TRANS_IN",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "充值成功",
        "body": "你的加密卡 Cregis Card 有一笔 1,280.50 USDT 充值已到账。"
      },
      "en-US": {
        "title": "Recharge Successful",
        "body": "A recharge of 1,280.50 USDT to your crypto card Cregis Card has been credited."
      },
      "zh-TW": {
        "title": "充值成功",
        "body": "你的加密卡 Cregis Card 有一筆 1,280.50 USDT 充值已到賬。"
      }
    }
  },
  {
    "id": "73",
    "templateKey": "KYB_MATERIALS_SUPPLEMENTED",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "企业认证材料需补充",
        "body": "认证文件材料不完善，具体原因：【材料不完整】。请前往认证邮箱查看邮件，并按要求补充认证材料。如需了解更多信息，请联系Cregis支持团队。"
      },
      "en-US": {
        "title": "Enterprise Verification Documents Required",
        "body": "The verification documents are incomplete. Specific reason: 【材料不完整】. Please check the email in your verification inbox and provide the required additional materials. To learn more, please contact the Cregis Support Team."
      },
      "zh-TW": {
        "title": "企業認證材料需補充",
        "body": "認證文件不完善，具體原因：【材料不完整】。請前往認證郵箱查看郵件，並按要求補充認證資料。如需了解更多資訊，請聯繫 Cregis 支援團隊。"
      }
    }
  },
  {
    "id": "76",
    "templateKey": "AUTO_RENEW_BALANCE_SUFFICIENT_REMIND",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "自动续费提醒",
        "body": "【Quant Inc.】团队内已开启自动续费的订阅即将到期，系统将于到期前1天自动扣款。当前账户余额充足。"
      },
      "en-US": {
        "title": "Auto-renewal reminder",
        "body": "The subscriptions with auto-renewal enabled in team [Quant Inc.] are about to expire. The system will automatically charge 1 day before expiration. The current account balance is sufficient."
      },
      "zh-TW": {
        "title": "自動續費提醒",
        "body": "【Quant Inc.】團隊內已開啟自動續費的訂閱即將到期，系統將於到期前1天自動扣款。當前賬戶餘額充足。"
      }
    }
  },
  {
    "id": "12",
    "templateKey": "TRANSACTION_SENT_FAIL",
    "category": "transaction",
    "canRedirect": true,
    "copy": {
      "zh-CN": {
        "title": "USDT:发送失败 -1,280.50",
        "body": "发送方:Treasury 0x1a2b…5678 \n接收方:Ops 0x9876…5432 \n所属团队:Quant Inc. \n所属钱包:Quant Vault"
      },
      "en-US": {
        "title": "USDT: fail to send -1,280.50",
        "body": "Sender: 0x1a2b…5678 Treasury\nReceiver: 0x9876…5432 Ops\nTeam: Quant Inc.\nWallet: Quant Vault"
      },
      "zh-TW": {
        "title": "USDT:發送失敗 -1,280.50",
        "body": "發送方:0x1a2b…5678 Treasury \n接收方:0x9876…5432 Ops \n所屬團隊:Quant Inc. \n所屬錢包:Quant Vault"
      }
    }
  },
  {
    "id": "27",
    "templateKey": "PERSONAL_CARD_STATUS_ACTIVE",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "加密卡解冻",
        "body": "你的加密卡 Cregis Card 已解除冻结，请前往 `个人空间-加密卡` 查看。"
      },
      "en-US": {
        "title": "Crypto Card Unfrozen",
        "body": "your crypto card Cregis Card has unfrozen,Please go to `Personal Space - Encryption Card` to view."
      },
      "zh-TW": {
        "title": "加密卡解凍",
        "body": "你的加密卡 Cregis Card 已解除凍結，請前往 `個人空間-加密卡` 檢視。"
      }
    }
  },
  {
    "id": "32",
    "templateKey": "USER_KYC_AUTH_FAIL",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "实名认证失败",
        "body": "你提交的实名认证失败，失败原因：材料不完整"
      },
      "en-US": {
        "title": "KYC Failed",
        "body": "Please be aware that your KYC has failed. Reason for failure: 材料不完整"
      },
      "zh-TW": {
        "title": "實名認證失敗",
        "body": "你提交的實名認證失敗，失敗原因：材料不完整"
      }
    }
  },
  {
    "id": "50",
    "templateKey": "CARD_TRANS_STATUS_CHANGE_SUCCESS",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "加密卡交易成功",
        "body": "你的加密卡 Cregis Card 有一笔1,280.50 USDT订单交易成功。"
      },
      "en-US": {
        "title": "Crypto Card Transacted Successfully",
        "body": "Your Cregis Card has transacted 1,280.50 USDT."
      },
      "zh-TW": {
        "title": "加密卡交易成功",
        "body": "你的加密卡 Cregis Card 一筆1,280.50 USDT訂單交易成功。"
      }
    }
  },
  {
    "id": "3",
    "templateKey": "TEAM_DISSOLUTION",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "团队解散",
        "body": "您的团队 Quant Inc. 已解散，请知悉."
      },
      "en-US": {
        "title": "Team dissolution",
        "body": "Please note that your team Quant Inc. has been disbanded."
      },
      "zh-TW": {
        "title": "團隊解散",
        "body": "您的團隊 Quant Inc. 已解散，请知悉."
      }
    }
  },
  {
    "id": "6",
    "templateKey": "KICK_TEAM",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "已移出团队",
        "body": "你已被移出团队 Quant Inc.."
      },
      "en-US": {
        "title": "Removed from Team",
        "body": "You have been removed from team Quant Inc.."
      },
      "zh-TW": {
        "title": "已移出團隊",
        "body": "你已被移出團隊 Quant Inc.。"
      }
    }
  },
  {
    "id": "49",
    "templateKey": "CARD_TRANS_STATUS_CHANGE_FAIL",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "加密卡订单交易失败",
        "body": "你的加密卡 Cregis Card 有一笔 1,280.50 USDT 订单交易失败。"
      },
      "en-US": {
        "title": "Crypto Card Transaction Failed",
        "body": "Transaction with the 1,280.50 USDT on your crypto card Cregis Card was Failed"
      },
      "zh-TW": {
        "title": "加密卡訂單交易失敗",
        "body": "你的加密卡 Cregis Card 有一筆 1,280.50 USDT 訂單交易失敗。"
      }
    }
  },
  {
    "id": "61",
    "templateKey": "TEAM_PROJECT_CALL_BACK_NOTICE",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "API回调异常通知",
        "body": "您所在团队【Quant Inc.】项目【Payment Engine】API回调异常，请登录客户端前往“项目-回调记录-异常回调”中查看处理"
      },
      "en-US": {
        "title": "API Callback Error Notification",
        "body": "Your team【Quant Inc.】 project 【Payment Engine】 encountered an API callback error . Please log in to the client and go to ‘Projects - Callback Records - Callback Error’ to review and handle it."
      },
      "zh-TW": {
        "title": "API回調異常通知",
        "body": "您所在團隊【Quant Inc.】項目【Payment Engine】API回調異常，請登錄客戶端前往“項目 - 回調記錄 - 異常回調”中查看處理。"
      }
    }
  },
  {
    "id": "72",
    "templateKey": "KYB_AUDIT_REJECT",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "企业认证失败",
        "body": "团队【Quant Inc.】企业认证失败，具体原因：【材料不完整】。如需了解更多信息或重新进行认证，请联系Cregis支持团队。"
      },
      "en-US": {
        "title": "Enterprise Verification Failed",
        "body": "Enterprise verification for team 【Quant Inc.】 failed. Specific reason: 【材料不完整】. To learn more or restart verification, please contact the Cregis Support Team."
      },
      "zh-TW": {
        "title": "企業認證失敗",
        "body": "團隊【Quant Inc.】企業認證失敗，具體原因：【材料不完整】。如需了解更多資訊或重新進行認證，請聯繫 Cregis 支援團隊。"
      }
    }
  },
  {
    "id": "78",
    "templateKey": "UBS_PACKAGE_EQUITY_AUTO_RENEW_FAIL",
    "category": "teamActivity",
    "canRedirect": true,
    "copy": {
      "zh-CN": {
        "title": "团队订阅项目自动续费失败",
        "body": "您的团队【Quant Inc.】的订阅【Business】即将到期。由于当前团队账户余额不足，系统自动扣款失败。为避免服务中断，请及时前往团队权益页面完成手动续费。"
      },
      "en-US": {
        "title": "Auto-Renewal Failed for Your Team’s Subscription",
        "body": "The subscription for [Business] under your team [Quant Inc.] is about to expire. The automatic renewal attempt was unsuccessful due to insufficient balance in your team account. To ensure uninterrupted service, please visit the Team Benefits page to manually renew your subscription at your earliest convenience."
      },
      "zh-TW": {
        "title": "團隊訂閱項目自動續費失敗",
        "body": "您的團隊【Quant Inc.】的訂閱【Business】即將到期。由於當前團隊帳戶餘額不足，系統自動扣款失敗。為避免服務中斷，請及時前往團隊權益頁面完成手動續訂。"
      }
    }
  },
  {
    "id": "1",
    "templateKey": "PAY_DEPOSIT",
    "category": "transaction",
    "canRedirect": true,
    "copy": {
      "zh-CN": {
        "title": "USDT:接收成功 +1,280.50",
        "body": "发送方:Treasury 0x1a2b…5678 \n接收方:Ops 0x9876…5432 \n所属团队:Quant Inc. \n所属钱包:Quant Vault"
      },
      "en-US": {
        "title": "USDT: received successfully + 1,280.50",
        "body": "Sender: Treasury 0x1a2b…5678\nReceiver: Ops 0x9876…5432\nTeam: Quant Inc.\nWallet: Quant Vault"
      },
      "zh-TW": {
        "title": "USDT:接收成功 +1,280.50",
        "body": "發送方:Treasury 0x1a2b…5678 \n接收方:Ops 0x9876…5432 \n所屬團隊:Quant Inc. \n所屬錢包:Quant Vault"
      }
    }
  },
  {
    "id": "7",
    "templateKey": "KICK_OUT_WALLET",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "已移出团队钱包",
        "body": "你已被移出团队钱包Quant Vault。"
      },
      "en-US": {
        "title": "Removed from Team Wallet",
        "body": "You have been removed from team wallet Quant Vault."
      },
      "zh-TW": {
        "title": "已移出團隊錢包",
        "body": "你已被移出團隊錢包Quant Vault。"
      }
    }
  },
  {
    "id": "45",
    "templateKey": "PERSONAL_CARD_SEND_USER",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "您的 Cregis 加密实体卡Cregis Card已寄出",
        "body": "请收到实体卡后，凭信内的激活码尽快激活实体卡。"
      },
      "en-US": {
        "title": "Your Cregis Crypto Physical Card Cregis Card is shipped",
        "body": "Please activate your physical with the activation code attached in the mail."
      },
      "zh-TW": {
        "title": "您的 Cregis 加密實體卡Cregis Card已寄出",
        "body": "請收到實體卡後，憑信內的激活碼儘快激活實體卡。"
      }
    }
  },
  {
    "id": "58",
    "templateKey": "TEAM_PROJECT_PAYMENT_CALL_BACK_NOTICE",
    "category": "teamActivity",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "支付引擎API回调异常通知",
        "body": "您的团队【Quant Inc.】支付引擎【Payment Engine】API回调异常，请登录客户端前往“支付引擎-回调记录-异常回调”中查看处理"
      },
      "en-US": {
        "title": "Payment Engine API Callback Error",
        "body": "Your team【Quant Inc.】 's Payment Engine 【Payment Engine】 has encountered an API callback error. Please log in to Cregis and go to ‘Payment Engine - Callback Record - Callback Error’ to view the details."
      },
      "zh-TW": {
        "title": "支付引擎API回調異常通知",
        "body": "您的團隊【Quant Inc.】支付引擎【Payment Engine】API回調異常，請登錄客戶端前往“支付引擎-回調記錄-異常回調”中查看處理。"
      }
    }
  },
  {
    "id": "69",
    "templateKey": "AML_SERVICE_NOT_SUPPORT",
    "category": "amlAlert",
    "canRedirect": false,
    "copy": {
      "zh-CN": {
        "title": "AML自动查询失败-所选服务商不支持该链",
        "body": "由于所选服务商不支持该交易所在的区块链网络，收款交易【0x8f3a…c21d】AML自动查询失败，本次查询费用已退还至团队账户余额。如需查询该笔交易，请尝试使用其他服务商进行手动查询或联系支持团队"
      },
      "en-US": {
        "title": "AML Auto Query Failed-Network Not Supported by the Selected Service Provider",
        "body": "The AML auto query for the incoming transaction【0x8f3a…c21d】failed since your selected service provider does not support the blockchain network the transaction resides in. The query fee has been refunded to the team balance. To query this transaction, please conduct a manual query with a different service provider, or contact the support team."
      },
      "zh-TW": {
        "title": "AML自動查詢失敗-所選服務商不支援該鏈",
        "body": "由於所選服務商不支援該交易所在的區塊鏈網絡，收款交易【0x8f3a…c21d】AML自動查詢失敗，本次查詢費用已退還至團隊賬戶餘額。如需查詢該筆交易，請嘗試使用其他服務商進行手動查詢或聯絡支援團隊。"
      }
    }
  }
];

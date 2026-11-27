/** 公告正文来自 https://support.cregis.com/announcement/zh-tw 。标题的英 / 简体取自同一索引。 */
export type AnnouncementBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'bullet'; text: string };

export type AnnouncementArticle = {
  id: string;
  title: { 'zh-CN': string; 'en-US': string; 'zh-TW': string };
  blocks: AnnouncementBlock[];
};

export const ANNOUNCEMENTS: readonly AnnouncementArticle[] = [
  {
    "id": "20261116",
    "title": {
      "zh-CN": "Cregis Swap 正式全面开放 · 跨链交易费用返还活动",
      "en-US": "Cregis Swap Now Fully Available · Cross-Chain Fee Rebate Program",
      "zh-TW": "Cregis Swap 正式全面開放 · 跨鏈交易費用返還活動"
    },
    "blocks": [
      {
        "type": "paragraph",
        "text": "尊敬的客戶："
      },
      {
        "type": "paragraph",
        "text": "Cregis Swap 現已面向全體客戶正式開放，同時，我們將推出跨鏈交易費用返還活動。"
      },
      {
        "type": "heading",
        "text": "活動時間"
      },
      {
        "type": "paragraph",
        "text": "2026 年 11 月 16 日 00:00 至 12 月 15 日 23:59（UTC+8）"
      },
      {
        "type": "heading",
        "text": "參與方式"
      },
      {
        "type": "paragraph",
        "text": "全體客戶，無需報名。"
      },
      {
        "type": "heading",
        "text": "返還規則"
      },
      {
        "type": "paragraph",
        "text": "按活動期間的累計跨鏈交易額（以 USDT 計）確定返還比例："
      },
      {
        "type": "bullet",
        "text": "累計 ≥ 1,000,000 USDT：返還 0.05%（即最低 500 USDT）"
      },
      {
        "type": "bullet",
        "text": "累計 ≥ 5,000,000 USDT：返還 0.07%（即最低 3,500 USDT）"
      },
      {
        "type": "paragraph",
        "text": "活動期間交易仍按標準費率收取，返還金額將於活動結束後 3 個工作日內發放至團隊帳戶餘額。"
      },
      {
        "type": "paragraph",
        "text": "如有疑問，請聯繫 Cregis 客服團隊或您的專屬客戶經理。感謝您對 Cregis 的信任與支援。"
      },
      {
        "type": "paragraph",
        "text": "Cregis 團隊\n2026-11-16"
      }
    ]
  },
  {
    "id": "v3-9-0",
    "title": {
      "zh-CN": "Cregis更新通知 - 版本 [V3.9.0]",
      "en-US": "Cregis Update Notification - Version [V3.9.0]",
      "zh-TW": "Cregis更新通知 - 版本 [V3.9.0]"
    },
    "blocks": [
      {
        "type": "paragraph",
        "text": "尊敬的Cregis用戶，"
      },
      {
        "type": "paragraph",
        "text": "您好！我們將於 2026/10/30 23:00 – 10/31 01:00（UTC）推出Cregis的最新版本 V3.9.0，此次更新為強制更新。系統維護期間，登錄、轉賬、API接入、收單等功能都會受到影響，充值可能延遲到賬，收單結算將在維護結束後進行。維護過程中，自動化相關設備（如簽名設備）將被自動登出，可能出現短暫離線情況。請您在維護完成後重新登錄相關設備，並重新啓用自動化配置（自動簽名/ 自動歸集），以確保自動化流程正常運行。我們非常抱歉給您帶來不便，請您提前安排業務，並在維護完成後根據需要升級版本並調整相關權限設置。"
      },
      {
        "type": "heading",
        "text": "本次更新包括："
      },
      {
        "type": "bullet",
        "text": "WaaS訂單模式上線（僅桌面端）"
      },
      {
        "type": "bullet",
        "text": "新增異常支付單通知提醒（僅桌面端）"
      },
      {
        "type": "bullet",
        "text": "支付引擎帳單優化（僅桌面端）"
      },
      {
        "type": "bullet",
        "text": "修復已知問題"
      },
      {
        "type": "paragraph",
        "text": "感謝您一直以來對Cregis的支持！如有任何疑問，請隨時聯繫我們。"
      },
      {
        "type": "paragraph",
        "text": "Cregis 團隊\n2026-10-29"
      }
    ]
  },
  {
    "id": "20260908",
    "title": {
      "zh-CN": "关于更新 Cregis 标准用户使用条款的通知",
      "en-US": "Notice of Updates to the Cregis Standard Terms of Service",
      "zh-TW": "關於更新 Cregis 標準用戶使用條款的通知"
    },
    "blocks": [
      {
        "type": "paragraph",
        "text": "尊敬的Cregis用戶，"
      },
      {
        "type": "paragraph",
        "text": "您好！我們將在 2026年9月12日 更新 Cregis 的標準用戶使用條款，屆時條款將自動更新，您無需進行任何手動操作。"
      },
      {
        "type": "paragraph",
        "text": "為幫助您提前瞭解相關內容，請前往Cregis 官網「資源 > 產品手冊 > [條款與細則](https://support.cregis.com/cregis-wallet-guide/zh-tw/terms_and_conditions/cregis-standard-terms-of-service)」先行查閱最新版本。如您對更新後的條款有任何疑問，歡迎隨時聯繫我們。"
      },
      {
        "type": "paragraph",
        "text": "感謝您一直以來對 Cregis 的支持！"
      },
      {
        "type": "paragraph",
        "text": "Cregis 團隊\n2026-09-08"
      }
    ]
  },
  {
    "id": "20260910",
    "title": {
      "zh-CN": "Cregis更新通知 - 版本 [V3.8.0]",
      "en-US": "Cregis Update Notification - Version [V3.8.0]",
      "zh-TW": "Cregis更新通知 - 版本 [V3.8.0]"
    },
    "blocks": [
      {
        "type": "paragraph",
        "text": "尊敬的Cregis用戶，"
      },
      {
        "type": "paragraph",
        "text": "您好！我們將於 2026/09/11 23:00 – 09/12 02:00（UTC）推出Cregis的最新版本 V3.8.0，此次更新為強制更新。系統維護期間，登錄、轉賬、API接入、收單等功能都會受到影響，充值可能延遲到賬，收單結算將在維護結束後進行。維護過程中，自動化相關設備（如簽名設備）將被自動登出，可能出現短暫離線情況。請您在維護完成後重新登錄相關設備，並重新啓用自動化配置（自動簽名/ 自動歸集），以確保自動化流程正常運行。我們非常抱歉給您帶來不便，請您提前安排業務，並在維護完成後根據需要升級版本並調整相關權限設置。"
      },
      {
        "type": "heading",
        "text": "本次更新包括："
      },
      {
        "type": "bullet",
        "text": "協作模塊優化"
      },
      {
        "type": "bullet",
        "text": "風控驗證升級"
      },
      {
        "type": "bullet",
        "text": "修復已知問題"
      },
      {
        "type": "paragraph",
        "text": "服務條款已更新，可前往Cregis 官網「資源 > 產品手冊 > [條款與細則](https://support.cregis.com/cregis-wallet-guide/zh-tw/terms_and_conditions/cregis-standard-terms-of-service)」中查看詳情，或升級後在 Cregis 客戶端「帳號設定 > 關於 Cregis > 服務條款」中查閱。"
      },
      {
        "type": "paragraph",
        "text": "感謝您一直以來對Cregis的支持！如有任何疑問，請隨時聯繫我們。"
      },
      {
        "type": "paragraph",
        "text": "Cregis 團隊\n2026-09-10"
      }
    ]
  },
  {
    "id": "20260804",
    "title": {
      "zh-CN": "Cregis更新通知 - 版本 [V3.7.5]",
      "en-US": "Cregis Update Notification - Version [V3.7.5]",
      "zh-TW": "Cregis更新通知 - 版本 [V3.7.5]"
    },
    "blocks": [
      {
        "type": "paragraph",
        "text": "尊敬的Cregis用戶，"
      },
      {
        "type": "paragraph",
        "text": "您好！我們將於2026年8月5日 23:00 - 8月6日 1:00（UTC）&#x63A8;出Cregis的最新版本 V3.7.5，此次更新爲非強制更新。請您提前安排業務，並於維護完成後按需要升級版本及調整相關權限設定；同時請重新登入相關設備，並啟用自動化配置（自動簽名/ 自動歸集），以確保自動化流程正常運作。"
      },
      {
        "type": "heading",
        "text": "本次更新包括："
      },
      {
        "type": "bullet",
        "text": "支付引擎開放異常支付單轉帳（僅桌面端）"
      },
      {
        "type": "bullet",
        "text": "錢包互動體驗優化"
      },
      {
        "type": "bullet",
        "text": "修復已知問題"
      },
      {
        "type": "paragraph",
        "text": "感謝您一直以來對Cregis的支持！如有任何疑問，請隨時聯繫我們。"
      },
      {
        "type": "paragraph",
        "text": "Cregis 團隊\n2026-08-04"
      }
    ]
  },
  {
    "id": "20260710",
    "title": {
      "zh-CN": "Cregis更新通知 - 版本 [V3.7.4]",
      "en-US": "Cregis Update Notification - Version [V3.7.4]",
      "zh-TW": "Cregis更新通知 - 版本 [V3.7.4]"
    },
    "blocks": [
      {
        "type": "paragraph",
        "text": "尊敬的Cregis用戶，"
      },
      {
        "type": "paragraph",
        "text": "您好！我們將於2026年7月14日 23:00 - 7月15日 1:00（UTC）&#x63A8;出Cregis的最新版本 V3.7.4，此次更新爲非強制更新。請您提前安排業務，並於維護完成後按需要升級版本及調整相關權限設定；同時請重新登入相關設備，並啟用自動化配置（自動簽名/ 自動歸集），以確保自動化流程正常運作。"
      },
      {
        "type": "heading",
        "text": "本次更新包括："
      },
      {
        "type": "bullet",
        "text": "團隊 API 管理上線（僅桌面端）"
      },
      {
        "type": "bullet",
        "text": "WaaS 項目功能優化（僅桌面端）"
      },
      {
        "type": "bullet",
        "text": "AML 服務配置調整"
      },
      {
        "type": "bullet",
        "text": "修復已知問題"
      },
      {
        "type": "paragraph",
        "text": "感謝您一直以來對Cregis的支持！如有任何疑問，請隨時聯繫我們。"
      },
      {
        "type": "paragraph",
        "text": "Cregis 團隊\n2026-07-10"
      }
    ]
  },
  {
    "id": "v3-7-3",
    "title": {
      "zh-CN": "Cregis更新通知 - 版本 [V3.7.3]",
      "en-US": "Cregis Update Notification - Version [V3.7.3]",
      "zh-TW": "Cregis更新通知 - 版本 [V3.7.3]"
    },
    "blocks": [
      {
        "type": "paragraph",
        "text": "尊敬的Cregis用戶，"
      },
      {
        "type": "paragraph",
        "text": "您好！我們將於2026年6月13日 23:00 - 6月14日 1:00（UTC）&#x63A8;出Cregis的最新版本 V3.7.3，此次更新爲非強制更新。請您提前安排業務，並於維護完成後按需要升級版本及調整相關權限設定；同時請重新登入相關設備，並啟用自動化配置（自動簽名/ 自動歸集），以確保自動化流程正常運作。"
      },
      {
        "type": "heading",
        "text": "本次更新包括："
      },
      {
        "type": "bullet",
        "text": "歸集模組升級（僅桌面端）"
      },
      {
        "type": "bullet",
        "text": "交易記錄數據權限提升（僅桌面端）"
      },
      {
        "type": "bullet",
        "text": "CSPN 匯款功能上線（僅桌面端）"
      },
      {
        "type": "bullet",
        "text": "地址簿風控配置增強"
      },
      {
        "type": "bullet",
        "text": "錢包功能選單優化"
      },
      {
        "type": "bullet",
        "text": "修復已知問題"
      },
      {
        "type": "heading",
        "text": "重要提醒："
      },
      {
        "type": "bullet",
        "text": "新版交易記錄（Report）已涵蓋原舊版功能，舊版視圖切換入口將於後續版本中下線，建議您提前切換至新版交易記錄功能。"
      },
      {
        "type": "paragraph",
        "text": "感謝您一直以來對Cregis的支持！如有任何疑問，請隨時聯繫我們。"
      },
      {
        "type": "paragraph",
        "text": "Cregis 團隊\n2026-06-10"
      }
    ]
  },
  {
    "id": "v3-7-1",
    "title": {
      "zh-CN": "Cregis更新通知 - 版本 [V3.7.1]",
      "en-US": "Cregis Update Notification - Version [V3.7.1]",
      "zh-TW": "Cregis更新通知 - 版本 [V3.7.1]"
    },
    "blocks": [
      {
        "type": "paragraph",
        "text": "尊敬的Cregis用戶，"
      },
      {
        "type": "paragraph",
        "text": "您好！我們將於2026年4月25日 23:00 - 4月26日 1:00（UTC）&#x63A8;出Cregis的最新版本 V3.7.1，此次更新爲非強制更新。請您提前安排業務，並於維護完成後按需要升級版本及調整相關權限設定；同時請重新登入相關設備，並啟用自動化配置（自動簽名/ 自動歸集），以確保自動化流程正常運作。"
      },
      {
        "type": "heading",
        "text": "本次更新包括："
      },
      {
        "type": "bullet",
        "text": "應用市場上線，支援更多功能擴展（僅桌面端）"
      },
      {
        "type": "bullet",
        "text": "導航結構及選單佈局優化（僅桌面端）"
      },
      {
        "type": "bullet",
        "text": "錢包界面展示更新"
      },
      {
        "type": "bullet",
        "text": "修復已知問題"
      },
      {
        "type": "paragraph",
        "text": "感謝您一直以來對Cregis的支持！如有任何疑問，請隨時聯繫我們。"
      },
      {
        "type": "paragraph",
        "text": "Cregis 團隊\n2026-04-23"
      }
    ]
  },
  {
    "id": "20260305",
    "title": {
      "zh-CN": "Cregis更新通知 - 版本 [V3.7.0]",
      "en-US": "Cregis Update Notification - Version [V3.7.0]",
      "zh-TW": "Cregis更新通知 - 版本 [V3.7.0]"
    },
    "blocks": [
      {
        "type": "paragraph",
        "text": "尊敬的Cregis用戶，"
      },
      {
        "type": "paragraph",
        "text": "您好！我們將於2026年3月14 23:00 - 3月15 1:00（UTC）&#x63A8;出Cregis的最新版本 V3.7.0，此次更新爲強制更新。系統維護期間，登錄、轉賬、API接入、收單等功能都會受到影響，充值可能延遲到賬，收單結算將在維護結束後進行。維護過程中，自動化相關設備（如簽名設備）將被自動登出，可能出現短暫離線情況。請您於維護完成後重新登入相關設備，並重新啟用自動化配置（自動簽名／自動歸集），以確保自動化流程正常運作。&#x6211;們對因此造成的不便深表歉意，敬請您提前安排業務，並於維護完成後按需要升級版本及調整相關權限設定。"
      },
      {
        "type": "heading",
        "text": "本次更新包括："
      },
      {
        "type": "paragraph",
        "text": "1. 錢包訂閱版本及價格全面升級\n2. KYC / KYB 模組優化\n3. 修復已知問題"
      },
      {
        "type": "paragraph",
        "text": "感謝您一直以來對Cregis的支持！如有任何疑問，請隨時聯繫我們。"
      },
      {
        "type": "paragraph",
        "text": "Cregis 團隊\n2026-03-05"
      }
    ]
  },
  {
    "id": "subscription-upgrade",
    "title": {
      "zh-CN": "【重要】Cregis 订阅套餐及服务体系全面升级预告",
      "en-US": "[Important] Announcement of Upcoming Upgrade to Cregis Subscription Structure",
      "zh-TW": "【重要】Cregis 訂閱方案及服務體系全面升級預告"
    },
    "blocks": [
      {
        "type": "paragraph",
        "text": "尊敬的 Cregis 用戶："
      },
      {
        "type": "paragraph",
        "text": "自成立以來，Cregis 一直致力為客戶提供安全、便捷的企業數字資產錢包服務。為進一步提升服務體驗與產品價值，我們計劃於 2026 年 3 月 對訂閱方案進行全面升級。"
      },
      {
        "type": "heading",
        "text": "主要調整如下："
      },
      {
        "type": "paragraph",
        "text": "1. 基礎版：免費，維持零門檻體驗。\n2. 高級版（$199/月）：承接原「商業版」權益。\n3. 商業版（$899/月）：承接原「企業版」權益，並大幅增加子地址數量；年付客戶可免每月自動化功能費。\n4. 企業版（$7,999/月）：全新推出，基礎權益不設限制，專為大型客戶量身打造。"
      },
      {
        "type": "heading",
        "text": "現有客戶權益保障："
      },
      {
        "type": "bullet",
        "text": "權益只增不減：於升級前已訂閱且尚未到期的用戶，原有權益於到期前保持不變，並將自動獲得對應新方案的部分增值權益（如更多子地址）。"
      },
      {
        "type": "bullet",
        "text": "價格保障機制：如您希望按現有方案價格進行訂閱或續費，請儘早完成操作，或聯絡您的客戶經理了解詳情。"
      },
      {
        "type": "paragraph",
        "text": "如有任何查詢，歡迎隨時聯絡我們。"
      },
      {
        "type": "paragraph",
        "text": "Cregis 團隊\n2026-02-19"
      }
    ]
  },
  {
    "id": "20251217",
    "title": {
      "zh-CN": "Cregis更新通知 - 版本 [V3.6.0]",
      "en-US": "Cregis Update Notification - Version [V3.6.0]",
      "zh-TW": "Cregis更新通知 - 版本 [V3.6.0]"
    },
    "blocks": [
      {
        "type": "paragraph",
        "text": "尊敬的Cregis用戶，"
      },
      {
        "type": "paragraph",
        "text": "您好！我們將於2025年12月21日 07:00 - 09:00（UTC+8）&#x63A8;出Cregis的最新版本 V3.6.0，此次更新爲強制更新。系統維護期間，登錄、轉賬、API接入、收單等功能都會受到影響，充值可能延遲到賬，收單結算將在維護結束後進行。我們非常抱歉給您帶來不便，請您提前安排業務，並在維護結束後視需要升級版本與調整權限。"
      },
      {
        "type": "heading",
        "text": "本次更新包括："
      },
      {
        "type": "paragraph",
        "text": "1. 交易記錄與匯出內容優化（僅限桌面端）\n2. MPC 分片管理優化\n3. 交易手續費與加速相關優化\n4. 修復已知問題"
      },
      {
        "type": "paragraph",
        "text": "感謝您一直以來對Cregis的支持！如有任何疑問，請隨時聯繫我們。"
      },
      {
        "type": "paragraph",
        "text": "Cregis團隊\n2025-12-17"
      }
    ]
  },
  {
    "id": "20251118",
    "title": {
      "zh-CN": "关于 Cloudflare 服务故障及已恢复的通知",
      "en-US": "Notice on Cloudflare Service Disruption and Restoration",
      "zh-TW": "關於 Cloudflare 服務故障及已恢復的通知"
    },
    "blocks": [
      {
        "type": "paragraph",
        "text": "尊敬的 Cregis 用戶："
      },
      {
        "type": "paragraph",
        "text": "您好！今日 19:48（UTC+8）起，Cregis 部分服務受到 Cloudflare 全球性故障影響，可能導致部分用戶在 API 調用及客戶端訪問時出現延遲或中斷。經過緊急監控與處理，服務已於 22:34（UTC+8）恢復正常。"
      },
      {
        "type": "paragraph",
        "text": "本次事件為 Cloudflare 全球性問題，不會對 Cregis 用戶資產造成影響。\n如需了解更多資訊，請訪問 Cloudflare 官方公告。"
      },
      {
        "type": "paragraph",
        "text": "我們將持續關注事件發展，如有任何問題，也會第一時間通知大家。"
      },
      {
        "type": "paragraph",
        "text": "感謝您一直以來對 Cregis 的支持！如有任何疑問，請隨時與我們聯繫。"
      },
      {
        "type": "paragraph",
        "text": "Cregis 團隊\n2025-11-18"
      }
    ]
  },
  {
    "id": "20250922",
    "title": {
      "zh-CN": "“守护资产，秒识风险” – AML特价限时体验",
      "en-US": "\"Guard Assets, Identify Risks in Seconds\" - AML Limited-Time Special Offer Campaign",
      "zh-TW": "「守護資產，秒識風險」– AML 特價限時體驗"
    },
    "blocks": [
      {
        "type": "paragraph",
        "text": "尊敬的 Cregis 用戶，"
      },
      {
        "type": "paragraph",
        "text": "您好！我們將攜手全球領先的區塊鏈風險監控供應商 Elliptic 及 Regtank，正式啟動 「鏈上護航，安心交易」 專項體驗活動！無論企業規模大小，安全起步同樣重要，快來助力您的業務安全發展吧！"
      },
      {
        "type": "heading",
        "text": "活動時間：2025年9月22日 - 10月31日（23:59 UTC+8）"
      },
      {
        "type": "heading",
        "text": "活動內容："
      },
      {
        "type": "paragraph",
        "text": "1. AML 限時體驗：本次活動限時 40 天\n2. 5 折超級優惠：享受歷史最低購買折扣"
      },
      {
        "type": "paragraph",
        "text": "| 提供商  | 原價 | 限時最低折扣 | 限時最低價格 |\n| -------- | ------ | ---------- | ---------- |\n| Elliptic | $2/次   | 5折         | $1/次       |\n| Regtank  | $0.3/次 | 5折         | $0.15/次    |\n3. 永久鎖定權益：活動期間，累計使用 Elliptic 查詢超過 500 次，或累計使用 Regtank 超過 1000 次，將永久鎖定 5 折折扣"
      },
      {
        "type": "heading",
        "text": "說明："
      },
      {
        "type": "bullet",
        "text": "Cregis AML 目前可進行地址風險評估（KYA）和交易風險評估（KYT），提供手動查詢和自動查詢兩項功能。"
      },
      {
        "type": "bullet",
        "text": "Cregis AML 功能目前僅對付費訂閱用戶開放。如需使用，請開通錢包訂閱方案。"
      },
      {
        "type": "bullet",
        "text": "Cregis AML 功能的費用不包含在月費中，需根據用戶使用次數單獨收費，請確保您的團隊帳戶餘額充足。"
      },
      {
        "type": "bullet",
        "text": "永久鎖定權益不可轉讓，僅限活動參與團隊使用。"
      },
      {
        "type": "bullet",
        "text": "使用說明：[AML 查詢功能 | Cregis](https://support.cregis.com/cregis-wallet-guide/zh-tw/risk_management/aml_query)"
      },
      {
        "type": "paragraph",
        "text": "如有任何疑問，歡迎隨時聯繫我們。"
      },
      {
        "type": "paragraph",
        "text": "Cregis 團隊\n2025-09-22"
      }
    ]
  },
  {
    "id": "20250918",
    "title": {
      "zh-CN": "Cregis更新通知 - 版本 [V3.5.0]",
      "en-US": "Cregis Update Notification - Version [V3.5.0]",
      "zh-TW": "Cregis更新通知 - 版本 [V3.5.0]"
    },
    "blocks": [
      {
        "type": "paragraph",
        "text": "尊敬的Cregis用戶，\n您好！我們將於2025年9月21日 07:00 - 08:00（UTC+8）&#x63A8;出Cregis的最新版本 V3.5.0，此次更新爲強制更新。系統維護期間，登錄、轉賬、API接入、收單等功能都會受到影響，充值可能延遲到賬，收單結算將在維護結束後進行。我們非常抱歉給您帶來不便，請您提前安排業務，並在維護結束後視需要升級版本與調整權限。"
      },
      {
        "type": "paragraph",
        "text": "為保障您的業務平穩運行，請您務必提前了解並做好相關設定，本次更新將對錢包邏輯進行部分調整："
      },
      {
        "type": "paragraph",
        "text": "1. 【協作】未處理的付款申請數據\n1. 系統將在更新時自動駁回這些交易申請。\n2. 【WaaS 項目】出款錢包設定\n1. 如未設定「出款錢包」或未在出款錢包中添加對應主網代幣，系統將在更新時自動駁回相關出款請求，並影響後續的出款請求。\n3. 【策略】已刪除策略所關聯的交易\n1. 這些交易詳情中將不再顯示「命中策略」資訊，如需查詢可聯絡 Cregis 支援團隊。"
      },
      {
        "type": "heading",
        "text": "本次更新包括："
      },
      {
        "type": "paragraph",
        "text": "1. 策略中心升級\n1. 調整策略與自動化入口\n2. 優化策略規則配置（僅限 PC 端）\n2. 錢包功能全面優化\n1. 新增內部轉賬快捷方式\n2. 支援更多 API 調用功能\n3. 優化錢包資金發送流程\n4. 優化手動歸集流程（僅限 PC 端）\n5. 新增 AML 風控服務商\n3. 修復已知問題與效能優化"
      },
      {
        "type": "paragraph",
        "text": "感謝您一直以來對Cregis的支持！如有任何疑問，請隨時聯繫我們。\nCregis團隊"
      },
      {
        "type": "paragraph",
        "text": "2025-09-18"
      }
    ]
  },
  {
    "id": "20250815",
    "title": {
      "zh-CN": "关于 Cregis TRON 链降低 Gas 费用的通知",
      "en-US": "Notice on Cregis TRON Network Gas Fee Reduction",
      "zh-TW": "關於 Cregis TRON 鏈降低 Gas 費用的通知"
    },
    "blocks": [
      {
        "type": "paragraph",
        "text": "尊敬的 Cregis 用戶，"
      },
      {
        "type": "paragraph",
        "text": "您好！為響應 TRON 鏈近期降低網絡能源成本，Cregis 已相應調整了 TRON 鏈的 Gas 費用以及 Cregis 錢包套餐能量折扣，您可查看錢包套餐了解詳情。"
      },
      {
        "type": "heading",
        "text": "此次調整，您使用 TRON 鏈轉賬的 Gas 費用將相應減少，我們誠邀您體驗！"
      },
      {
        "type": "paragraph",
        "text": "感謝您一直以來對 Cregis 的支持! 如有任何疑問，請隨時聯繫我們。"
      },
      {
        "type": "paragraph",
        "text": "Cregis 團隊\n2025-09-05"
      }
    ]
  },
  {
    "id": "v3-4-0",
    "title": {
      "zh-CN": "Cregis更新通知 - 版本 [V3.4.0]",
      "en-US": "Cregis Update Notification - Version [V3.4.0]",
      "zh-TW": "Cregis更新通知 - 版本 [V3.4.0]"
    },
    "blocks": [
      {
        "type": "paragraph",
        "text": "尊敬的Cregis用戶，"
      },
      {
        "type": "paragraph",
        "text": "您好！我們將於2025年8月17日 07:00 - 08:00（UTC+8）&#x63A8;出Cregis的最新版本 V3.4.0，此次更新爲強制更新。系統維護期間，登錄、轉賬、API接入、收單等功能都會受到影響，充值可能延遲到賬，收單結算將在維護結束後進行。我們非常抱歉給您帶來不便，請您提前安排業務，並在維護結束後視需要升級版本與調整權限。"
      },
      {
        "type": "heading",
        "text": "本次更新內容如下："
      },
      {
        "type": "paragraph",
        "text": "1. 支付引擎模組升級\n1. 優化項目建立及管理流程\n2. 支援使用加密貨幣作為訂單幣種\n3. 支援多幣種及跨鏈結算\n2. 錢包功能優化\n1. 新增 API 項目出款錢包設定\n2. 支援交易憑證下載與分享（僅限 App 端）\n3. 修復已知問題與效能優化"
      },
      {
        "type": "paragraph",
        "text": "感謝您一直以來對Cregis的支持！如有任何疑問，請隨時聯繫我們。"
      },
      {
        "type": "paragraph",
        "text": "Cregis團隊\n2025-08-15"
      }
    ]
  },
  {
    "id": "v3-3-0",
    "title": {
      "zh-CN": "Cregis更新通知 - 版本 [V3.3.0]",
      "en-US": "Cregis Update Notification - Version [V3.3.0]",
      "zh-TW": "Cregis更新通知 - 版本 [V3.3.0]"
    },
    "blocks": [
      {
        "type": "paragraph",
        "text": "尊敬的Cregis用戶，"
      },
      {
        "type": "paragraph",
        "text": "您好！我們將於<mark style=\"color:green;\">2025年7月19日 07:00 - 08:00（UTC+8）</mark>推出Cregis的最新版本 <mark style=\"color:green;\">V3.3.0</mark>，此次更新爲<mark style=\"color:green;\">強制更新</mark>。系統維護期間，登錄、轉賬、API接入、收單等功能都會受到影響，充值可能延遲到賬，收單結算將在維護結束後進行。我們非常抱歉給您帶來不便，請您提前安排業務，並在維護結束後視需要升級版本與調整權限。"
      },
      {
        "type": "heading",
        "text": "本次更新內容如下："
      },
      {
        "type": "paragraph",
        "text": "1. 錢包功能與操作體驗優化\n1. 優化錢包建立流程\n2. 多簽錢包新增分片恢復與重置功能\n3. 支援查閱與匯出交易憑證詳情（僅限 PC 版）\n2. 新增公鏈支援\n1. 支援 Aptos 及 Cardano 網絡\n3. 問題修復與效能提升"
      },
      {
        "type": "paragraph",
        "text": "感謝您一直以來對Cregis的支持！如有任何疑問，請隨時聯繫我們。\nCregis團隊"
      },
      {
        "type": "paragraph",
        "text": "2025-07-16"
      }
    ]
  },
  {
    "id": "v3-2-0",
    "title": {
      "zh-CN": "Cregis更新通知 - 版本 [V3.2.0]",
      "en-US": "Cregis Update Notification - Version [V3.2.0]",
      "zh-TW": "Cregis更新通知 - 版本 [V3.2.0]"
    },
    "blocks": [
      {
        "type": "paragraph",
        "text": "尊敬的Cregis用戶，"
      },
      {
        "type": "paragraph",
        "text": "您好！我們將於<mark style=\"color:green;\">2025年6月12日 07:00 - 08:00（UTC+8）</mark>推出Cregis的最新版本 <mark style=\"color:green;\">V3.2.0</mark>，此次更新爲<mark style=\"color:green;\">非強制更新</mark>。系統維護期間，登錄、轉賬、API接入、收單等功能都會受到影響，充值可能延遲到賬，收單結算將在維護結束後進行。我們非常抱歉給您帶來不便，請您提前安排業務，並在維護結束後視需要升級版本與調整權限。\n\n本次更新內容如下："
      },
      {
        "type": "paragraph",
        "text": "1. 修復已知問題"
      },
      {
        "type": "paragraph",
        "text": "感謝您一直以來對Cregis的支持！如有任何疑問，請隨時聯繫我們。\n\nCregis團隊\n2025-06-10"
      }
    ]
  },
  {
    "id": "v3-1-0",
    "title": {
      "zh-CN": "Cregis更新通知- 版本 [V3.1.0]",
      "en-US": "Cregis Update Notification - Version [V3.1.0]",
      "zh-TW": "Cregis更新通知- 版本 [V3.1.0]"
    },
    "blocks": [
      {
        "type": "paragraph",
        "text": "尊敬的Cregis用戶，"
      },
      {
        "type": "paragraph",
        "text": "您好！我們將於<mark style=\"color:green;\">2025年4月27日 07:00 - 08:00（UTC+8）</mark>推出Cregis的最新版本 <mark style=\"color:green;\">V3.1.0</mark>，此次更新爲<mark style=\"color:green;\">強制更新</mark>。系統維護期間，登錄、轉賬、API接入、收單等功能都會受到影響，充值可能延遲到賬，收單結算將在維護結束後進行。我們非常抱歉給您帶來不便，請您提前安排業務，並在維護結束後及時升級版本及調整相關權限。"
      },
      {
        "type": "paragraph",
        "text": "本次更新內容如下："
      },
      {
        "type": "paragraph",
        "text": "1. AML 功能全面升級（APP 端僅支持查詢記錄）\n1. 支持自動查詢、手動查詢、查詢記錄詳情等\n2. 新增 AML 規則配置\n2. KYB 認證支援企業證明資料審核\n3. 優化項目及支付引擎模組回調記錄顯示（僅支持 PC 端）\n4. 錢包多鏈幣種增加餘額狀態展示（僅支持 PC 端）\n5. 帳單匯出功能優化（僅支持 PC 端）\n6. 修復已知問題"
      },
      {
        "type": "paragraph",
        "text": "感謝您一直以來對Cregis的支持！如有任何疑問，請隨時聯繫我們。"
      },
      {
        "type": "paragraph",
        "text": "Cregis團隊\n2025-04-24"
      }
    ]
  },
  {
    "id": "v3-0-0",
    "title": {
      "zh-CN": "Cregis更新通知 - 版本 [V3.0.0]",
      "en-US": "Cregis Update Notification - Version [V3.0.0]",
      "zh-TW": "Cregis更新通知- 版本 [V3.0.0]"
    },
    "blocks": [
      {
        "type": "paragraph",
        "text": "尊敬的Cregis用戶，\n\n您好！我們將於2025年3月30日 07:00 - 09:00（UTC+8）推出Cregis的最新版本V3.0.0，此次更新爲強制更新。系統維護期間，登錄、轉賬、API接入、收單等功能都會受到影響，充值可能延遲到賬，收單結算將在維護結束後進行。我們非常抱歉給您帶來不便，請您提前安排業務，並在維護結束後及時升級版本及調整相關權限。\n\n本次更新內容如下："
      },
      {
        "type": "paragraph",
        "text": "1. 基礎版團隊權益調整（不影響商業版、企業版）：\n1. 新增每月發送額度限制（超出部分將收取一定比例的超額手續費）；\n2. 成員數量、API地址數量、API付款筆數減少（如果目前已經超出，仍可正常使用，但不可新增）；\n2. 新增支付引擎模塊（僅支持PC端）；\n1. 新增支付記錄、結算記錄導出功能；\n2. 新增支付引擎模塊權限設置；\n3. 新增3條公鏈：SUI、Bitcoin Cash、opBNB；\n4. 新增43種代幣；\n5. 自動化權限與策略權限剝離（僅支持PC端）；\n6. UI優化及問題修複。"
      },
      {
        "type": "paragraph",
        "text": "感謝您一直以來對Cregis的支持！如有任何疑問，請隨時聯繫我們。\n\nCregis團隊2025-03-27"
      }
    ]
  },
  {
    "id": "v2-15-0",
    "title": {
      "zh-CN": "Cregis更新通知- 版本 [V2.15.0]",
      "en-US": "Cregis Update Notification - Version [V2.15.0]",
      "zh-TW": "Cregis更新通知- 版本 [V2.15.0]"
    },
    "blocks": [
      {
        "type": "paragraph",
        "text": "我們將在 2025年1月8日20:30:00 (UTC+8) 推出Cregis的最新版本V2.15.0。此次更新為強制更新，更新時間需約一小時，更新內容如下：<br>"
      },
      {
        "type": "paragraph",
        "text": "1. 訂單收款API優化及新增回調重推機制（僅支持PC端）\n2. 充值、提幣API接口回調重推方案優化（僅支持PC端）\n3. 自動歸集、自動簽名功能優化（僅支持PC端）\n4. 批量付款及歸集交易記錄顯示優化（僅支持PC端）\n5. 新增支持多語言帳單導出（僅支持PC端）\n6. 加密卡激活流程優化及新增PIN碼設置\n7. 加密卡功能介面升級及數據展示優化\n8. BTC網絡新增交易加速功能\n9. MPC網絡設置交互優化\n10. 新增支持Ripple（XRP）鏈及Filecoin（FIL）鏈"
      },
      {
        "type": "paragraph",
        "text": "Cregis團隊\n2025-01-07"
      }
    ]
  },
  {
    "id": "v2-14-0",
    "title": {
      "zh-CN": "Cregis更新通知- 版本 [V2.14.0]",
      "en-US": "Cregis Update Notification - Version [V2.14.0]",
      "zh-TW": "Cregis更新通知- 版本 [V2.14.0]"
    },
    "blocks": [
      {
        "type": "paragraph",
        "text": "我們將在 2024年12月16日16:00:00 (UTC+8) 推出Cregis的最新版本V2.14.0。此次更新為強制更新，更新時間需約一小時，更新內容如下："
      },
      {
        "type": "paragraph",
        "text": "1. 新增線上收銀台（網頁版）\n2. 新增 sign message 本地信息簽名驗證（僅支援 PC 端）\n3. Cregis 團隊管理安全升級（支援 PC 及 APP 端）"
      },
      {
        "type": "paragraph",
        "text": "Cregis團隊"
      },
      {
        "type": "paragraph",
        "text": "2024-12-13"
      }
    ]
  },
  {
    "id": "tron-energy",
    "title": {
      "zh-CN": "团队企业版 Tron 能量折扣调整通知",
      "en-US": "Tron Energy Discount Update for Enterprise Plan",
      "zh-TW": "團隊企業版 Tron 能量折扣調整通知"
    },
    "blocks": [
      {
        "type": "paragraph",
        "text": "自 2024 年 12 月 4 日 09:00:00 (UTC+8) 起，Cregis 團隊企業版適用於普通交易的 Tron 能量折扣將從 5 折 調整為 6 折。 如有任何疑問，請隨時聯繫 Cregis 團隊。"
      },
      {
        "type": "paragraph",
        "text": "Cregis團隊"
      },
      {
        "type": "paragraph",
        "text": "2024-12-11"
      }
    ]
  }
] as AnnouncementArticle[];

export function findAnnouncement(id: string): AnnouncementArticle | undefined {
  return ANNOUNCEMENTS.find((item) => item.id === id);
}

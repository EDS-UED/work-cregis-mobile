# Git 分支、权限与协作流程

> 业务仓库：`EDS-UED/work-cregis-mobile`  
> 设计系统：`EDS-UED/eds-mobile`（路径 `../eds-mobile`）  
> Agent 规范入口：`.cursor/rules/work.md` §3.3  
> 本文面向 **人工操作**；给 Cursor 说 **提交 / 拉取 / 推 / 同步** 时以 `work.md` §3.3.1 为准。

---

## 1. 总览

```text
jojo ──PR（须 yang 审）──► yang ──PR（0 review，EAS check）──► main
                              │                                    │
                              └─ 维护者日常开发、收 jojo 代码          └─ 同事 EAS preview 对齐
```

| 概念 | 含义 |
|------|------|
| **提交** | 仅本地 `commit`，不 `push` |
| **拉取** | 本机分支对齐 **已 merge 的远端同名分支**（≠ 拉 EDS dist） |
| **推** | `yang` 集成到 **`main`** + 等 EAS **preview** 成功 |
| **同步** | 仅指拉最新 **`@eds-evergreen/mobile` dist**（§3.1.2），与 Git 拉取无关 |

---

## 2. 双仓库

| 本地目录 | GitHub 远程 | 作用 |
|----------|-------------|------|
| `work-cregis-mobile` | [EDS-UED/work-cregis-mobile](https://github.com/EDS-UED/work-cregis-mobile) | Cregis 业务 App |
| `../eds-mobile` | [EDS-UED/eds-mobile](https://github.com/EDS-UED/eds-mobile) | EDS Mobile；EAS 构建时 **clone `main` + `pnpm build:mobile`** |

**推业务到 `main` 时**：若 DS 有改动，应先 **`eds-mobile` 的 `main` 已 push**，再合业务 `main`，避免云端短暂「新 JS + 旧 EDS」。（Workflow 默认 `EDS_MOBILE_GIT_REF=main`。）

### 2.1 EDS Mobile 仓库：只读同步 vs 写入

EDS 与业务仓 **分支模型不同**：eds-mobile 默认 **只有维护者写 `main`**；其他人 **只能同步（读）**，不能改远端。

| 仓库 | 分支 | 谁能 push |
|------|------|-----------|
| **eds-mobile** | `main` | **仅维护者** `theyangsong`（Ruleset bypass） |
| **work-cregis-mobile** | `jojo` / `yang` / `main` | 见下文 §3 |

**他人「同步」EDS（无写权限）**

- 业务仓：`「同步」` → `ensure-eds-mobile.mjs` + `npm install`（拉 `main` 构建 dist）
- 或只读：`git clone` / `git pull` [EDS-UED/eds-mobile](https://github.com/EDS-UED/eds-mobile)（public 可读；push 会 403 / Ruleset 拦截）

**协作者（当前）**

| 用户 | eds-mobile 角色 |
|------|-----------------|
| `theyangsong` | Admin + Ruleset bypass |
| `lulujj123` | **Read**（可拉代码，不可 push） |

**Ruleset**：[eds-mobile / main](https://github.com/EDS-UED/eds-mobile/rules/27710775) — 禁删、禁强推、禁无 bypass 的 push。

完整说明（维护者推送、新人 checklist）：[eds-mobile · git-access-and-collaboration.md](https://github.com/EDS-UED/eds-mobile/blob/main/docs/git-access-and-collaboration.md)（维护者 push 该文件后进 `main` 后，链接即稳定）。

---

## 3. 三分支角色（仅 work-cregis-mobile）

> 历史：旧分支名 `dev` 已更名为 **`yang`**。

| 分支 | 用途 | 谁可以 push | 怎么进这个分支 |
|------|------|-------------|----------------|
| **`jojo`** | jojo 功能开发 | **jojo**（`lulujj123`） | 在 `jojo` 上 commit / push |
| **`yang`** | 维护者开发 + 集成 jojo | **yang**（`theyangsong`，可直推） | jojo：**PR → `yang`**；维护者：直推 |
| **`main`** | 对外集成、EAS OTA 对齐 | **禁止**日常直 push | **仅** **`yang` → `main` PR**（维护者操作） |

**禁止**：jojo 直推 `yang` / `main`；任何人在 `main` 上日常直改。

---

## 4. GitHub Rulesets（权限与技术约束）

仓库：[Settings → Rules](https://github.com/EDS-UED/work-cregis-mobile/settings/rules)

| 规则集 | 保护分支 | 规则要点 | Bypass（可跳过规则的人） |
|--------|----------|----------|---------------------------|
| [**main**](https://github.com/EDS-UED/work-cregis-mobile/rules/23519770) | `main` | 禁删/强推/直 push；合并须 PR；**required review = 0** + EAS 绿 | **`theyangsong`**（维护者 merge，等同 `work-yang` bypass） |
| [**work-yang**](https://github.com/EDS-UED/work-cregis-mobile/rules/27705187) | `yang` | 同上；**`jojo`→`yang` PR 须 +1 review** | `theyangsong`（直推 `yang`、代合并） |
| [**work-jojo**](https://github.com/EDS-UED/work-cregis-mobile/rules/27705869) | `jojo` | 禁删/强推/直 push | `lulujj123`、`theyangsong` |

### 审批分工（约定）

| 流向 | 要不要人工 Approve | 谁操作 |
|------|---------------------|--------|
| **jojo → yang** | **要**（至少 1 次，由维护者审） | **yang**：Review → Approve → Merge |
| **yang → main** | **不要**（0 review；不靠给自己点 Approve） | **yang**：等 CI/EAS check 绿 → 直接 Merge |

`main` 上仍走 **PR + EAS「Publish preview update」**，只是不等「假二审」。

---

## 5. 角色速查

| GitHub 用户 | 角色 | 典型操作 |
|-------------|------|----------|
| **theyangsong**（yang） | 维护者 / 管理员 | 直推 `yang`；审并 merge **jojo→yang**；开并 merge **yang→main**；本地多在 `yang` |
| **lulujj123**（jojo） | 功能开发 | 直推 **`jojo`**；开 PR **base: `yang`**；不能自合进 `yang` |

换分支（双方通用）：

```bash
git fetch origin
git checkout yang   # 或 jojo
git pull origin yang   # 或 jojo
```

---

## 6. 流程 A：jojo 交付给 yang

**参与者**：jojo 提交 PR，**yang 审合并**。

### jojo

1. 在 `jojo` 分支开发：`git checkout jojo` → commit → `git push origin jojo`
2. GitHub：**New pull request** — **base: `yang`** · **compare: `jojo`**
3. 填标题/说明，创建 PR；**不要**自己 Merge（缺 review 会 blocked）

### yang（维护者）

1. 打开 PR 列表（可筛 `is:pr base:yang`）
2. 看 **Files changed**、讨论、自动化检查
3. **Review changes** → **Approve**（或 Request changes）
4. **Merge pull request**

**命令行（yang，`gh` 已登录）**：

```bash
gh pr list --base yang
gh pr review <编号> --approve
gh pr merge <编号> --merge
```

### yang 合并后同步到本机

```bash
cd work-cregis-mobile
git fetch origin
git checkout yang
git pull origin yang
```

有未提交改动：`git stash` → `pull` → `git stash pop`。

---

## 7. 流程 B：yang 集成到 main（对外 preview）

**仅维护者**；目标：**GitHub `main` = 当前远端 `yang`**，且 EAS **preview** 与之一致。

### 检查清单

- [ ] 在 **`yang`** 上，工作区干净
- [ ] `git pull origin yang`
- [ ] `npm run typecheck`
- [ ] 若改了 `eds-mobile`：其 **`main` 已 push**（先于业务 `main`）

### 步骤

1. `git push origin yang`（若有新 commit）
2. **New pull request** — **base: `main`** · **compare: `yang`**
3. 等 **Publish preview update** ✅（EAS Workflow）
4. **Merge**（**不需要** Approve）；或 **`gh pr merge <n> --auto --merge`**（仓库已开 `allow_auto_merge`，检查绿后自动合入）
5. 规则集 **main** 已配 **`theyangsong` bypass**（与 `work-yang` 一致，维护者不等假二审）
6. 本地对齐：

```bash
git pull origin main
git checkout yang
git merge origin/main
```

或让 Cursor 执行关键词 **「推」**（按 `work.md` §3.3.1 完整跑通）。

### EAS / 同事预览

| 项 | 值 |
|----|-----|
| Team | `theyangsongs-team` |
| 项目 | `cregis`（`@theyangsongs-team/cregis`） |
| Channel | `preview` |
| SDK | **Expo Go SDK 58** |
| Dashboard | https://expo.dev/accounts/theyangsongs-team/projects/cregis → **Updates** → Preview 二维码 |

详解：[eas-expo-go-preview.md](./eas-expo-go-preview.md)

**查看 Workflow 状态**：

```bash
npx eas-cli workflow:runs --limit 5
```

---

## 8. 维护者（yang）日常开发

| 意图 | 做法 |
|------|------|
| 本地改代码 | `git checkout yang`，正常开发 |
| 只备份到 GitHub `yang` | commit 后 `git push origin yang`（不算完整「推」到 preview） |
| 收 jojo 代码 | 流程 A → **拉取** |
| 给同事发 OTA | 流程 B 或对 Cursor 说 **推** |
| 拉最新 EDS dist 到本机 | 说 **同步**（跑 `ensure-eds-mobile` 等），不是 `git pull` |

---

## 9. 常见问题

### PR 显示「Review required」

| PR 类型 | 是否正常 | 操作 |
|---------|----------|------|
| **jojo → yang** | 正常 | yang **Approve** 后再 Merge |
| **yang → main** | 异常（规则应为 0 review） | 核对 [main 规则](https://github.com/EDS-UED/work-cregis-mobile/rules/23519770)；Checks 绿后应能直接 Merge。若 UI 缓存仍 blocked，维护者可用 bypass fast-forward `main`（与 PR 同内容），详见 `work.md` §3.3.1 |

### 不能给自己 PR 点 Approve

GitHub 不允许作者给自己 PR Approve；**yang→main 本来就不该走这一步**。

### 「拉取」和「同步」

- **拉取**：`git pull origin yang`（或 jojo 拉 `jojo`）
- **同步**：更新 `node_modules` / `file:../eds-mobile` dist，**不自动发生**

---

## 10. 与 Agent 关键词对照

| 你对 Cursor 说 | Agent 会做（摘要） |
|----------------|-------------------|
| **提交** | 在 `yang` 上 commit + typecheck，**不** push |
| **拉取** | `fetch` / `pull origin yang`；若刚推过 main 会再 `merge origin/main` |
| **推** | `yang→main` PR + merge + eds-mobile 顺序 + 等 EAS + 给 Preview 信息 |
| **同步** | `ensure-eds-mobile` / `npm install` 等（**不是** Git pull） |

---

## 11. 修订记录

| 日期 | 说明 |
|------|------|
| 2026-11-20 | 初版：`main` 0 review、`work-yang` jojo 进 yang +1 review；§2.1 eds-mobile 只读同步 |

规则变更后请同步更新本文与 `.cursor/rules/work.md` §3.3。
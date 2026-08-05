# Mr. Jo 个人网站 — 项目进度

> 最后更新：2026-08-05  
> 生产站点：[portfolio-site-alpha-six-14.vercel.app](https://portfolio-site-alpha-six-14.vercel.app)  
> 发布方式：推送 GitHub `main` 后，由 Vercel 自动部署

## 总览

**核心里程碑：12 / 20**

`████████████░░░░░░░░` 60%

这里的百分比只按下方 19 个功能/内容里程碑计算，不代表视觉完成度。新增需求时分母也会增加；只有真实完成并验证的事项才会勾选。

## 已完成

- [x] 个人品牌首页：Hero、我的故事、记录、Journal、在做的事、世界尽头
- [x] 「我的故事 + 记录」双栏布局；短记录按日期倒序展示
- [x] MDX Journal 内容框架与文章详情页
- [x] Neon + Prisma 数据层、预约 API 与课程数据
- [x] 预约流程、邮件通知与 NextAuth 管理后台
- [x] 私密简历路由与密码门
- [x] 简历中文 / English 双语切换
- [x] 简历实习公司与项目分类的 hover / 点击式展开
- [x] 简历 GitHub / LinkedIn 视觉入口；生成两页英文投递版 DOCX 与 PDF（不提交公开仓库）
- [x] 世界尽头的门、五幕对话仪式、闪烁/剪影与暗界切换
- [x] 光界 / 暗界双文案和主要 Section 的暗界视觉
- [x] 来访者 Echo 入库、名字之湖与世界边界提示

## 未完成

- [ ] 用真实内容替换 3 篇 MDX 占位文章，并补充后续日志
- [ ] 用真实项目替换 `/projects` 的 `MOCK_PROJECTS`，补 GitHub / Demo 链接
- [ ] 完成首页、预约、Journal 的中 / 英国际化；评估是否增加韩语
- [ ] 增加联系方式区块、微信二维码与社交链接
- [ ] 购买并绑定自定义域名
- [ ] 制作 1200 × 630 的 OG 社交分享图
- [ ] 为 Echo 接口增加速率限制、滥用防护及“名字可能公开展示”的明确说明
- [ ] 用真实手机完成门的长按、五幕仪式、名字之湖和返回位置的整套验收

## 暂缓 / 风险

### 仓库私有化

- [ ] **暂缓**：仓库目前保持 public，保证 GitHub → Vercel 自动部署稳定。
- 历史记录：同一项目在仓库为 private 时，Git 提交在构建开始前被 Vercel 标记为 `BLOCKED`；切回 public 后恢复正常。
- 后续处理：需要时再核对 Vercel 账户/Team 成员资格与 GitHub App 私库授权；验证通过后才能切 private。
- 公开仓库意味着网页密码门不能保护源代码。`lib/resumeContent.ts` 中的简历内容会被 GitHub 直接读取；不要提交任何秘密、令牌或真正需要保密的资料。

### 已知工程风险

- [ ] 本地 `next build` 会联网下载 Google Fonts；受 DNS/代理限制时可能失败，后续可改为本地字体资产。
- [ ] 暗界交互依赖 pointer/hover/long-press，不同移动浏览器仍需要真机回归。
- [ ] 当前没有自动化 E2E 测试，交互回归主要依赖人工验收。

## 内容入口

- 短记录：`data/journalEntries.ts`
- 长文章：`content/journal/*.mdx`
- 首页故事 / 在做的事 / 项目占位：`lib/content.ts`
- 简历：`lib/resumeContent.ts`
- 更细的素材清单：[`public/CONTENT_TODO.md`](public/CONTENT_TODO.md)

## 更新规则

每次功能或内容更新时：

1. 保持未完成事项为未勾选状态。
2. 完成后先验证，再勾选并更新日期。
3. 在“暂缓 / 风险”记录阻塞原因，不用聊天结论代替项目记录。
4. 推送 `main` 后确认 Vercel 部署为 `READY`。

# Content TODO — 待补齐的真实素材

> 当前身份与文案基线：**Mr. Jo / 地球 Online 在线玩家**，首页标题为「这是我的记录。」。不要恢复旧的「姓名占位」或左右滑动入口。

## 我的故事与记录
- [ ] `lib/content.ts → JOURNEY_STEPS` 目前是短句版轨迹（滑雪 / coding / 背包上路 / 继续探索）；后续若有具体年份、照片或完整故事，再扩写，不需要先补占位文字。
- [ ] `data/journalEntries.ts` 目前仅保留一条真实记录；新增记录时写入 `date`、`light`、`dark`、`darkTier`，页面会自动按日期倒序展示。

## Journal 文章（content/journal/*.mdx）
- [ ] `restart.mdx` / `ski-lessons.mdx` / `solo-travel.mdx` 三篇都是占位正文，替换为真实内容
- [ ] 想加新文章：直接在 `content/journal/` 新建一个 `.mdx` 文件，写好 frontmatter（title/tag/date/summary/cover）即可，首页和列表页会自动收录，不用改代码
- [ ] `ski-lessons.mdx` 里的 `<VideoEmbed videoId="BV1xxXXXxxx" />` 换成真实 BV 号
- [ ] 每篇的 `cover` 目前是色块占位（hex 色值），后续可以换成真实图片 URL（需要同步调整 `Journal.tsx` / `app/journal/page.tsx` / `[slug]/page.tsx` 里 `style={{background: post.cover}}` 改成 `<Image src={post.cover} />`）

## Ventures（lib/content.ts → VENTURES）
- [ ] 首页标签当前是「滑雪教练」；实际课程信息仍在 Neon 的 Course 数据中维护。
- [ ] 我的项目（app/projects/page.tsx，数据在 lib/content.ts → MOCK_PROJECTS）：项目名/描述/技术栈/GitHub 或 Demo 链接
- [ ] 旅行 · 文化分享：目前直接链到 `/journal?tag=Travel`，往这个 tag 多写几篇 Journal 文章即可

## 联系方式
- [ ] ClosingInvite 下面目前没有具体联系方式入口（微信二维码/邮箱/社交链接），需要补一个小联系区块
- [ ] 微信二维码图片 → `public/images/wechat-qr.png`

## 域名 & 部署（Phase 7）
- [ ] 你的域名（Vercel 里绑定）
- [ ] OG 图（社交分享封面）→ `public/og-image.jpg`（推荐 1200x630px）

## 国际化（i18n，确认要做，未排期）
- [x] `/resume` 已有基于语义整理的中文 / English 切换。
- [ ] 目标受众含韩国/欧美游客；主页、预约、Journal 仍需用 `app/[locale]/` + i18n 字典完成中 / 英（可能 + 韩）版本。

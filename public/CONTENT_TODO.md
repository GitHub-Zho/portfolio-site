# Content TODO — 需要填充的真实内容

## 个人信息（components/sections/Hero.tsx）
- [ ] 姓名（替换 "姓名占位"，同时改 `app/layout.tsx` 的 metadata）
- [ ] Hero 文案是否要换成更贴近你自己说话方式的版本（现在是占位的"嗨，我在这里 — 一个还在认真生活、认真探索的人。"）

## Journey 时间线（lib/content.ts → JOURNEY_STEPS）
- [ ] 替换 4 个人生节点为真实故事（标题 + 对应颜色已有，只需改文字）

## Journal 文章（content/journal/*.mdx）
- [ ] `restart.mdx` / `ski-lessons.mdx` / `solo-travel.mdx` 三篇都是占位正文，替换为真实内容
- [ ] 想加新文章：直接在 `content/journal/` 新建一个 `.mdx` 文件，写好 frontmatter（title/tag/date/summary/cover）即可，首页和列表页会自动收录，不用改代码
- [ ] `ski-lessons.mdx` 里的 `<VideoEmbed videoId="BV1xxXXXxxx" />` 换成真实 BV 号
- [ ] 每篇的 `cover` 目前是色块占位（hex 色值），后续可以换成真实图片 URL（需要同步调整 `Journal.tsx` / `app/journal/page.tsx` / `[slug]/page.tsx` 里 `style={{background: post.cover}}` 改成 `<Image src={post.cover} />`）

## Ventures（lib/content.ts → VENTURES）
- [ ] 滑雪私教 → 实际课程信息在 Phase 4/5 接 Neon 数据库后填（`prisma/seed.ts`）
- [ ] 我的项目（app/projects/page.tsx，数据在 lib/content.ts → MOCK_PROJECTS）：项目名/描述/技术栈/GitHub 或 Demo 链接
- [ ] 旅行 · 文化分享：目前直接链到 `/journal?tag=Travel`，往这个 tag 多写几篇 Journal 文章即可

## 联系方式
- [ ] ClosingInvite 下面目前没有具体联系方式入口（微信二维码/邮箱/社交链接），需要补一个小联系区块
- [ ] 微信二维码图片 → `public/images/wechat-qr.png`

## 域名 & 部署（Phase 7）
- [ ] 你的域名（Vercel 里绑定）
- [ ] OG 图（社交分享封面）→ `public/og-image.jpg`（推荐 1200x630px）

## 国际化（i18n，确认要做，未排期）
- [ ] 目标受众含韩国/欧美游客，需要中/英（可能+韩）多语言。等内容稳定后再做 `app/[locale]/` 路由包装，不影响现在的组件结构

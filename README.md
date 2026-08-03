# Mr. Jo — 个人网站

一个以「探索与记录」为主线的个人主页：光界是温暖、生活方式化的个人品牌；在页面尽头，访客可以发现一扇通往 Rusty Lake 风格镜中世界的门。

生产站点：[portfolio-site-alpha-six-14.vercel.app](https://portfolio-site-alpha-six-14.vercel.app)

## 当前产品边界

- 首页：Hero → 我的故事 / 记录 → MDX Journal → 在做的事 → 世界尽头。
- 暗界：**不使用任何左右滑动或页面级 drag 手势**。桌面端 hover 蓄力、手机端长按页面底部的门；五幕对话仪式答对后进入暗界，刷新才会回到光界。
- 内容：文章写在 `content/journal/*.mdx`，短记录写在 `data/journalEntries.ts`，新增日期会自动倒序展示。
- 简历：`/resume` 有应用层密码门，支持中文 / English 切换；项目按 Agent / CV / Backend & Systems / Web & Data 分类。
- 业务：`/booking` 是预约流程，`/admin` 是受 NextAuth 保护的管理后台。

> 仓库目前为公开仓库。不要提交 `.env*`、个人联系信息以外的敏感数据，或任何未来不希望被公开读取的简历内容；网页密码门不能替代源代码仓库权限。

## 技术栈

- Next.js 16 App Router + React 19 + TypeScript
- Tailwind CSS v4 + Framer Motion
- Neon PostgreSQL + Prisma 7 + `@prisma/adapter-neon`
- NextAuth v5、Resend、MDX (`gray-matter` + `next-mdx-remote`)
- Vercel（GitHub `main` 自动部署）

## 本地运行

```bash
npm install
npm run dev
```

常用验证：

```bash
npm run lint
npx tsc --noEmit
npm run build
```

`next/font/google` 会在 build 时下载 Fraunces / Geist 字体；若本机 DNS 受限，构建会在字体下载阶段失败。Vercel 的生产构建已验证可用。

## 环境变量

复制并填写本机的 `.env.local`（该文件被忽略）。主要变量：

```text
DATABASE_URL=
DATABASE_URL_UNPOOLED=
AUTH_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
NEXTAUTH_URL=
NEXT_PUBLIC_SITE_URL=
RESUME_ACCESS_SECRET=
RESUME_ACCESS_ANSWER=
```

Prisma CLI 在这台机器上不应直接运行；使用 `package.json` 里的 `db:*` 脚本，它们会避开本机代理变量。

## 发布规则

常规发布只需提交并推送 `main`：

```bash
git push origin main
```

Vercel 已与 GitHub 仓库绑定，推送后会自动构建并发布。不要把 Vercel CLI 作为常规发布方式；仅在诊断或需要临时预览时使用。

待补齐的内容与素材见 [`public/CONTENT_TODO.md`](public/CONTENT_TODO.md)。完整的产品演进计划目前维护在工作区文档中，不随公开仓库发布，以免把内部规划和个人资料一并公开。

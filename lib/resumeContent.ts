// Real content, extracted from 周宇辰_简历.docx (2026-06-23).
// Synthesized (not on the original document): `title` headline below the name —
// derived from real degree + skill domains on the résumé, not invented. Adjust freely.
//
// 2026-07-09: added recent GitHub projects, grouped the Agent work together —
// China Video Bot (20+ agent pipeline) + Dreamina Agent (vision-loop browser
// agent) join Event-GenAI under the Agent category; Explore China / 薪资采集 +
// 简历自动投递 / ECE1724 Rust added. Bullets grounded in each repo, matched to
// the résumé's existing terse achievement-oriented style.

export const RESUME = {
  name: '周宇辰',
  title: '多伦多大学工程硕士在读 · 生成式AI / 大数据工程',
  contacts: {
    phone: '+86 187-5022-0537',
    phoneAlt: '+1 437-363-6879',
    email: 'yuchen.zhou.zzz@gmail.com',
    github: 'https://github.com/GitHub-Zho',
    linkedin: 'https://www.linkedin.com/in/yuchen-zhou-jo/',
  },

  education: [
    {
      school: '多伦多大学（University of Toronto）',
      degree: '工程硕士（M.Eng）— 电气与计算机工程（ECE）',
      period: '2025 – 2027',
    },
    {
      school: '伦敦玛丽女王大学（QMUL）',
      degree: '交换生 · GPA 91/100 · 一等荣誉（First Class Honor）',
      period: '2023 – 2024',
    },
    {
      school: '北京邮电大学',
      degree: '物联网工程学士 · GPA 88/100 · 全班前5%（排名 16/308）',
      period: '2020 – 2024',
    },
  ],

  skills: {
    编程语言: ['Python', 'Java', 'C/C++', 'SQL', 'Rust', 'Bash / Linux Shell'],
    框架与工具: ['PyTorch', 'TensorFlow', 'LangChain', 'OpenAI / Claude / Qwen API', 'Playwright', 'FFmpeg', 'Kafka', 'Flink', 'Docker', 'Kubernetes', 'Git'],
    专业领域: ['多 Agent 系统', '生成式 AI', 'GPU/CUDA', '分布式训练', '大数据工程', '联邦学习', '操作系统', '网络编程'],
  },

  experience: [
    {
      company: '美团（北京三快在线科技有限公司）',
      role: '系统开发实习生 — 内部数据分析平台',
      period: '2023.05 – 2023.07',
      bullets: [
        '独立设计并完成内部控制系统核心模块的开发与测试；封装 Thrift 接口供前端调用，并编写自动化测试脚本验证接口功能与延迟 SLA',
        '优化推理流水线的处理逻辑、数据过滤与缓存策略，通过减少 IO 交互次数并改进联表查询方式，将数据查询模块端到端耗时缩短 30%，降低运营成本',
        '负责业务决策数据仓库的开发与维护，提供关键业务指标的可视化报告，支撑内部管理决策',
      ],
    },
    {
      company: '美亚柏科（厦门美亚柏科信息股份有限公司）',
      role: 'Java 开发实习生 — 大数据工程',
      period: '2022.04 – 2022.07',
      bullets: [
        '基于 Apache Kafka 与 Flink 构建实时金融数据流处理流水线，部署于 Linux 集群，为交易策略团队提供低延迟市场行情数据',
        '优化分布式作业配置与处理算法，提升数据吞吐量与准确性；使用 Docker 与 Kubernetes 完成大数据平台的集群部署与运维',
      ],
    },
    {
      company: '厦门汉印电子有限公司',
      role: '软件开发管培生（前端方向）',
      period: '2021.07 – 2021.09',
      bullets: ['参与商业数据可视化系统的开发，通过精准的数据采集与统计分析提升市场预测的准确性与时效性'],
    },
  ],

  projects: [
    {
      name: '操作系统内核实现（C++）',
      period: '2022 – 2023',
      tags: ['C/C++', '操作系统', '进程管理', '内存管理'],
      bullets: [
        '从零实现一套完整的操作系统内核，涵盖系统守护进程、堆栈空间分配、进程 PCB 模块、用户态/内核态切换机制、读写锁及信号中断处理',
        '实现基础的进程调度管理、内存管理与权限控制等核心功能，深入理解操作系统底层运行机制与系统级并发设计',
      ],
    },
    {
      name: '多人在线射击游戏「诺曼底战役」',
      period: '2022',
      tags: ['C++', 'TCP/UDP', 'Socket', '服务端架构'],
      bullets: [
        '基于 TCP/UDP 与 Socket 协议实现多客户端实时通信，负责数据包解包、内容解析、日志输出、构建、转发与缓存的完整链路设计',
        '将核心计算集中于服务端，通过算法与数据结构优化实现高可用、低延迟的多用户并发体验',
      ],
    },
    {
      name: '基于姿态引导的视频生成模型（科研）',
      period: '2023 – 2024',
      tags: ['导师：Changjae Oh 教授（QMUL & 帝国理工）', 'PyTorch', 'GPU/CUDA', 'Stable Diffusion'],
      bullets: [
        '将 Stable Diffusion 文生图模型扩展至视频生成任务，通过参考图像输入实现对人脸、服装、背景及肢体姿态的精细化控制',
        '引入跨帧注意力机制（Cross-Frame Attention）与共享潜在变量技术，有效抑制帧间背景噪声，在 GPU 显存与推理计算之间精细取舍，确保视频时序一致性',
      ],
    },
    {
      name: '面向隐私保护的联邦学习框架',
      period: '2022 – 2023',
      tags: ['Python', 'PyTorch', 'GPU', '分布式系统'],
      bullets: [
        '设计联邦学习流水线，通过本地参数更新实现跨节点分布式 GPU 模型训练，在保护数据隐私的前提下最小化节点间传输数据量',
        '应用梯度压缩与分布式参数特征提取，在保持模型精度的同时显著降低通信开销，支持异构设备上的可扩展部署',
      ],
    },
    {
      name: 'Event-GenAI — 基于 Agent 的活动推荐系统',
      period: '2025 – 2026',
      tags: ['Python', 'LangChain', 'OpenAI API', 'Tavily', '排序模型'],
      bullets: [
        '基于 Tavily 搜索 API 与 GPT-4 构建 LLM Agent 流水线，实现个性化活动的实时检索、内容理解与排序推荐的端到端闭环',
        '集成 Learning-to-Rank 模型对 Agent 输出进行后处理，通过迭代评分与反馈持续优化推荐质量',
      ],
    },
    {
      name: 'China Video Bot — 全自动 AI 短视频生成与发布流水线',
      period: '2026',
      tags: ['Python', '多 Agent 编排', 'Qwen-max / Qwen-VL', 'FFmpeg', 'YouTube / Meta API'],
      bullets: [
        '设计 Orchestrator 编排 20+ 个专职 Agent（导演、脚本评审、配音、素材竞选、视觉质检、双平台发布等），打通从选题、分镜脚本、AI 配音字幕到成片与发布（YouTube 16:9 / Instagram Reels 9:16）的端到端无人值守流水线',
        '采用「生成器—校验器」分离架构：Qwen-max 生成分镜脚本、独立的 Critic 评分并触发重写；Qwen-VL 对库存素材、AI 生成图与参考视频逐镜打分择优，成片后再做画面/字幕质检与自动修复',
        '实现「参考视频」模式：两遍视觉理解源视频、构建带时间戳的步骤时间轴，将旁白逐句匹配真实片段裁成纪录片式成片；部署于云服务器每日定时运行，本地缓存帧与时间轴、自动续期 Instagram 长效 Token',
      ],
    },
    {
      name: 'Dreamina Agent — 视觉反馈闭环的自动出图 Agent',
      period: '2026',
      tags: ['Python', 'Playwright', 'Claude (Sonnet / Haiku)', '浏览器自动化', '视觉评分'],
      bullets: [
        '用 Playwright 持久化浏览器上下文驱动 Dreamina（CapCut）生图 Web 应用，构建「生成—执行—观察—优化」的闭环 Agent：Haiku 低成本生成与改写提示词，浏览器自动出图，Sonnet 视觉模型为结果打分',
        '以多轮迭代自动逼近目标（连续达标即停），把依赖经验的「提示词工程」转化为可量化、可自动收敛的反馈循环',
      ],
    },
    {
      name: 'Explore China 2026 — 留学生旅行项目官网',
      period: '2026',
      tags: ['Astro 5', 'React', 'Tailwind', '双语 i18n', 'Vercel'],
      bullets: [
        '基于 Astro 5 + Tailwind 构建高性能中/英双语静态官网，将社交媒体流量转化为行程申请；行程信息集中于单一数据源、由模板按结构化数据渲染，杜绝价格与文案硬编码',
        '引入构建前质量门禁（图片存在性、链接可达性、双语路由对等校验）与 Vercel 分支预览部署工作流',
      ],
    },
    {
      name: '薪资数据采集分析 · 简历自动投递助手',
      period: '2026',
      tags: ['Python', '数据爬取', '浏览器自动化', 'Excel 自动化'],
      bullets: [
        '抓取 levels.fyi 等公开薪酬平台数据，经清洗、去重与聚合后产出结构化分析报告，用于薪资横向对标',
        '在此基础上扩展简历的自动投递与表单自动填写，把重复的求职操作交由程序完成',
      ],
    },
    {
      name: 'Rust 系统级工具实现（多伦多大学 ECE1724）',
      period: '2025',
      tags: ['Rust', 'CLI', '所有权 / 借用', 'Reversi'],
      bullets: [
        '以 Rust 从零实现 curl、grep 等命令行工具及 Reversi 对弈程序，在工程实践中掌握所有权与借用、基于 Result / Option 的错误处理与零成本抽象等系统级范式',
      ],
    },
  ],

  awards: [
    'ACM/ICPC — 北京邮电大学校级金奖（2021）',
    '全国大学生创新创业竞赛 — 国家级三等奖（2023）',
    '校级奖学金（2021、2022、2023）',
    '北京邮电大学优秀毕业生（2024）',
    '其他：高考理综 280+，剑桥 offer',
  ],
}

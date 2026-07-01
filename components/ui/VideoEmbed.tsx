interface VideoEmbedProps {
  platform: 'bilibili' | 'youtube'
  videoId: string
  title: string
}

const EMBED_URL: Record<VideoEmbedProps['platform'], (id: string) => string> = {
  bilibili: (id) => `https://player.bilibili.com/player.html?bvid=${id}&autoplay=0`,
  youtube: (id) => `https://www.youtube.com/embed/${id}`,
}

export function VideoEmbed({ platform, videoId, title }: VideoEmbedProps) {
  return (
    <div className="aspect-video rounded-xl overflow-hidden bg-cream-dim my-6">
      <iframe
        src={EMBED_URL[platform](videoId)}
        title={title}
        loading="lazy"
        allowFullScreen
        className="w-full h-full border-0"
      />
    </div>
  )
}

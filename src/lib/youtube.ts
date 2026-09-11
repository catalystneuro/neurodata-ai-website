export const youtubeWatch = (id: string) => `https://www.youtube.com/watch?v=${id}`;
export const youtubeEmbed = (id: string) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
export const youtubeThumb = (id: string, size: "hq" | "mq" | "maxres" = "hq") => `https://i.ytimg.com/vi/${id}/${size}default.jpg`;
export const playlistUrl = (id: string) => `https://www.youtube.com/playlist?list=${id}`;

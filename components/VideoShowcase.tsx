import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import BlurText from './BlurText';
import { Theme, Language } from '../types';
import { CONTENT } from '../constants';

interface VideoShowcaseProps {
  theme: Theme;
  lang: Language;
}

const VideoShowcase: React.FC<VideoShowcaseProps> = ({ theme, lang }) => {
  const t = CONTENT[lang];

  return (
    <section className="min-h-screen py-20 px-4 md:px-12 relative z-10">
      <div className="container mx-auto">
        <SectionWrapper>
          <div className="mb-20 text-center">
            <BlurText text={t.videos.title} as="h2" className="text-4xl md:text-6xl font-bold mb-4" />
            <p className="text-xl opacity-60">{t.videos.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.videos.items.map((video, index) => (
              <VideoCard key={video.id} video={video} index={index} theme={theme} lang={lang} />
            ))}
          </div>
        </SectionWrapper>
      </div>
    </section>
  );
};

const VideoCard: React.FC<{
  video: (typeof CONTENT)['en']['videos']['items'][0];
  index: number;
  theme: Theme;
  lang: Language;
}> = ({ video, index, theme, lang }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const t = CONTENT[lang];
  const handleMouseEnter = () => {
    videoRef.current?.play();
  };

  const handleMouseLeave = () => {
    videoRef.current?.pause();
    if (videoRef.current) videoRef.current.currentTime = 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      viewport={{ once: true }}
      className={`group relative aspect-[9/16] md:aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer ${theme === 'dark' ? 'bg-nl-black border border-nl-dark/30' : 'bg-gray-100 border border-gray-200'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
    >
      <div className="absolute inset-0 z-10 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />

      <video ref={videoRef} src={video.src} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" muted playsInline loop />

      {/* Overlay UI */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 transition-opacity duration-300">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <span className="text-nl-neon text-sm font-mono mb-2 block">{video.category}</span>
          <h3 className="text-2xl font-bold text-white mb-4">{video.title}</h3>
          <div className="flex items-center gap-2 text-white/80 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            <div className="w-8 h-8 rounded-full bg-nl-neon text-nl-black flex items-center justify-center">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <span>{CONTENT['zh'].videos.title === t.videos.title ? '观看预览' : 'Watch Preview'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoShowcase;

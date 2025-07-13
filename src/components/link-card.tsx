// components/link-card.tsx
'use client';

import { useState } from 'react';
import { Disclosure, DisclosureContent, DisclosureTrigger } from '@/components/core/disclosure';
import { motion, MotionProps } from 'framer-motion'; // Import MotionProps for transition type
import data from '@/app/ads/data.json';

export interface AdEntry {
  library_id: string;
  status: string;
  start_date: string;
  platforms: string[];
  ads_count: number;
  image_url: string | null;
  video_url: string | null;
  ad_text: string;
  link: string;
  ad_details_url: string;
}

export function LinkCardGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
      {data.map((ad: AdEntry) => (
        <LinkCard key={ad.library_id} ad={ad} />
      ))}
    </div>
  );
}

interface LinkCardProps {
  ad: AdEntry;
}

export function LinkCard({ ad }: LinkCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const imageVariants = {
    collapsed: { scale: 1, filter: 'blur(0px)' },
    expanded: { scale: 1.05, filter: 'blur(2px)' },
  };

  const contentVariants = {
    collapsed: { opacity: 0, y: 10 },
    expanded: { opacity: 1, y: 0 },
  };

  const transition: MotionProps['transition'] = {
    type: 'spring', // `spring` is a valid type
    stiffness: 30,
    damping: 5,
    mass: 0.3,
  };

  return (
    <div
      className="relative h-[350px] w-full overflow-hidden rounded-xl cursor-pointer"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {ad.image_url ? (
        <motion.img
          src={ad.image_url}
          alt={ad.ad_text.slice(0, 80) + '...'}
          className="pointer-events-none h-full w-full object-cover select-none"
          animate={isOpen ? 'expanded' : 'collapsed'}
          variants={imageVariants}
          transition={transition}
        />
      ) : ad.video_url ? (
        <motion.video
          src={ad.video_url}
          className="pointer-events-none h-full w-full object-cover select-none"
          autoPlay
          muted
          loop
          animate={isOpen ? 'expanded' : 'collapsed'}
          variants={imageVariants}
          transition={transition}
        />
      ) : (
        <div className="h-full w-full bg-zinc-200 dark:bg-zinc-800" />
      )}

      <Disclosure
        open={isOpen}
        onOpenChange={setIsOpen}
        className="absolute bottom-0 left-0 right-0 rounded-t-xl bg-black bg-opacity-60 px-4 pt-2 pb-4 text-white backdrop-blur-md"
        variants={contentVariants}
        transition={transition}
      >
        <DisclosureTrigger>
          <button
            className="w-full text-left text-lg font-semibold"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
          >
            {ad.library_id}
          </button>
        </DisclosureTrigger>
        <DisclosureContent>
          <div className="mt-2 space-y-1 text-sm">
            <p>
              <strong>Status:</strong> {ad.status}
            </p>
            <p>
              <strong>Start:</strong> {new Date(ad.start_date).toLocaleDateString()}
            </p>
            <p>
              <strong>Platforms:</strong> {ad.platforms.join(', ')}
            </p>
            <p>
              <strong>Ads Count:</strong> {ad.ads_count}
            </p>
            <a
              href={ad.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-blue-300 underline"
            >
              View in Library
            </a>
          </div>
        </DisclosureContent>
      </Disclosure>
    </div>
  );
}

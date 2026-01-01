'use client'

import {
  MediaControlBar,
  MediaController,
  MediaMuteButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaTimeDisplay,
  MediaTimeRange,
  MediaVolumeRange,
} from 'media-chrome/react'
import type { ComponentProps } from 'react'

import { cn } from '~/lib/utils'

export type VideoPlayerProps = ComponentProps<typeof MediaController>

export const VideoPlayer = ({ style, ...props }: VideoPlayerProps) => (
  <MediaController
    style={{
      ...style,
    }}
    {...props}
  />
)

export type VideoPlayerControlBarProps = ComponentProps<typeof MediaControlBar>

export const VideoPlayerControlBar = (props: VideoPlayerControlBarProps) => <MediaControlBar {...props} />

export type VideoPlayerTimeRangeProps = ComponentProps<typeof MediaTimeRange>

export const VideoPlayerTimeRange = ({ className, ...props }: VideoPlayerTimeRangeProps) => (
  <MediaTimeRange
    className={cn('[--media-range-thumb-opacity:0] [--media-range-track-height:2px]', className)}
    {...props}
  />
)

export type VideoPlayerTimeDisplayProps = ComponentProps<typeof MediaTimeDisplay>

export const VideoPlayerTimeDisplay = ({ className, ...props }: VideoPlayerTimeDisplayProps) => (
  <MediaTimeDisplay className={cn('p-2.5', className)} {...props} />
)

export type VideoPlayerVolumeRangeProps = ComponentProps<typeof MediaVolumeRange>

export const VideoPlayerVolumeRange = ({ className, ...props }: VideoPlayerVolumeRangeProps) => (
  <MediaVolumeRange className={cn('p-2.5', className)} {...props} />
)

export type VideoPlayerPlayButtonProps = ComponentProps<typeof MediaPlayButton>

export const VideoPlayerPlayButton = ({ className, ...props }: VideoPlayerPlayButtonProps) => (
  <MediaPlayButton className={cn('', className)} {...props} />
)

export type VideoPlayerSeekBackwardButtonProps = ComponentProps<typeof MediaSeekBackwardButton>

export const VideoPlayerSeekBackwardButton = ({ className, ...props }: VideoPlayerSeekBackwardButtonProps) => (
  <MediaSeekBackwardButton className={cn('p-2.5', className)} {...props} />
)

export type VideoPlayerSeekForwardButtonProps = ComponentProps<typeof MediaSeekForwardButton>

export const VideoPlayerSeekForwardButton = ({ className, ...props }: VideoPlayerSeekForwardButtonProps) => (
  <MediaSeekForwardButton className={cn('p-2.5', className)} {...props} />
)

export type VideoPlayerMuteButtonProps = ComponentProps<typeof MediaMuteButton>

export const VideoPlayerMuteButton = ({ className, ...props }: VideoPlayerMuteButtonProps) => (
  <MediaMuteButton className={cn('', className)} {...props} />
)

export type VideoPlayerContentProps = ComponentProps<'video'>

export const VideoPlayerContent = ({ className, ...props }: VideoPlayerContentProps) => (
  <video className={cn('mt-0 mb-0', className)} playsInline {...props} />
)

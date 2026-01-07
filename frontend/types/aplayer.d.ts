declare module 'aplayer' {
  export interface APlayerOptions {
    container?: HTMLElement
    fixed?: boolean
    mini?: boolean
    autoplay?: boolean
    theme?: string
    loop?: 'all' | 'one' | 'none'
    order?: 'list' | 'random'
    preload?: 'none' | 'metadata' | 'auto'
    volume?: number
    mutex?: boolean
    listFolded?: boolean
    listMaxHeight?: string
    lrcType?: number
    audio: Array<{
      name: string
      artist: string
      url: string
      cover?: string
      lrc?: string
      theme?: string
    }>
    storageName?: string
  }

  export default class APlayer {
    constructor(options: APlayerOptions)
    play(): void
    pause(): void
    seek(time: number): void
    toggle(): void
    on(event: string, handler: Function): void
    destroy(): void
    volume(percentage: number, showNotice?: boolean): void
    theme(color: string, index?: number): void
    setMode(mode: 'normal' | 'mini'): void
    notice(text: string, time?: number, opacity?: number): void
    skipForward(): void
    skipBack(): void
  }
}


declare module 'viewerjs' {
  export interface ViewerOptions {
    inline?: boolean
    button?: boolean
    navbar?: boolean | number
    title?: boolean | number
    toolbar?: boolean | number
    tooltip?: boolean
    movable?: boolean
    zoomable?: boolean
    rotatable?: boolean
    scalable?: boolean
    transition?: boolean
    fullscreen?: boolean
    keyboard?: boolean
    url?: string | ((image: HTMLImageElement) => string)
    ready?: (viewer: Viewer) => void
    show?: (viewer: Viewer) => void
    shown?: (viewer: Viewer) => void
    hide?: (viewer: Viewer) => void
    hidden?: (viewer: Viewer) => void
    view?: (viewer: Viewer) => void
    viewed?: (viewer: Viewer) => void
    zoom?: (viewer: Viewer) => void
    zoomed?: (viewer: Viewer) => void
  }

  export default class Viewer {
    constructor(element: HTMLElement | string, options?: ViewerOptions)
    show(index?: number): void
    hide(): void
    view(index?: number): void
    update(): void
    destroy(): void
    zoom(ratio: number, hasTooltip?: boolean): void
    zoomTo(ratio: number, hasTooltip?: boolean): void
    rotate(degree: number): void
    rotateTo(degree: number): void
    scale(scaleX: number, scaleY?: number): void
    scaleX(scaleX: number): void
    scaleY(scaleY: number): void
    move(x: number, y: number): void
    moveTo(x: number, y: number): void
    reset(): void
    clear(): void
    tooltip(): void
    toggle(): void
    full(): void
    exit(): void
    play(fullscreen?: boolean): void
    stop(): void
    prev(loop?: boolean): void
    next(loop?: boolean): void
  }
}


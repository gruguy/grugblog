
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T


export const ArticleCard: typeof import("../components/ArticleCard.vue").default
export const Badge: typeof import("../components/Badge.vue").default
export const Banner: typeof import("../components/Banner.vue").default
export const Button: typeof import("../components/Button.vue").default
export const Comment: typeof import("../components/Comment.vue").default
export const DragCaptcha: typeof import("../components/DragCaptcha.vue").default
export const Empty: typeof import("../components/Empty.vue").default
export const GitHubStyleCalendar: typeof import("../components/GitHubStyleCalendar.vue").default
export const ImagePicker: typeof import("../components/ImagePicker.vue").default
export const MarkdownAnchor: typeof import("../components/MarkdownAnchor.vue").default
export const Message: typeof import("../components/Message.vue").default
export const Modal: typeof import("../components/Modal.vue").default
export const Popup: typeof import("../components/Popup.vue").default
export const PuzzleCaptcha: typeof import("../components/PuzzleCaptcha.vue").default
export const Skeleton: typeof import("../components/Skeleton.vue").default
export const SlideCaptcha: typeof import("../components/SlideCaptcha.vue").default
export const ThirdPartyCaptcha: typeof import("../components/ThirdPartyCaptcha.vue").default
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue").default
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout").default
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue").default
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only").default
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only").default
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder").default
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link").default
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator").default
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue").default
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer").default
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtImg
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtPicture
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page").default
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components").NoScript
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components").Link
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components").Base
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components").Title
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components").Meta
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components").Style
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components").Head
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components").Html
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components").Body
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island").default
export const LazyArticleCard: LazyComponent<typeof import("../components/ArticleCard.vue").default>
export const LazyBadge: LazyComponent<typeof import("../components/Badge.vue").default>
export const LazyBanner: LazyComponent<typeof import("../components/Banner.vue").default>
export const LazyButton: LazyComponent<typeof import("../components/Button.vue").default>
export const LazyComment: LazyComponent<typeof import("../components/Comment.vue").default>
export const LazyDragCaptcha: LazyComponent<typeof import("../components/DragCaptcha.vue").default>
export const LazyEmpty: LazyComponent<typeof import("../components/Empty.vue").default>
export const LazyGitHubStyleCalendar: LazyComponent<typeof import("../components/GitHubStyleCalendar.vue").default>
export const LazyImagePicker: LazyComponent<typeof import("../components/ImagePicker.vue").default>
export const LazyMarkdownAnchor: LazyComponent<typeof import("../components/MarkdownAnchor.vue").default>
export const LazyMessage: LazyComponent<typeof import("../components/Message.vue").default>
export const LazyModal: LazyComponent<typeof import("../components/Modal.vue").default>
export const LazyPopup: LazyComponent<typeof import("../components/Popup.vue").default>
export const LazyPuzzleCaptcha: LazyComponent<typeof import("../components/PuzzleCaptcha.vue").default>
export const LazySkeleton: LazyComponent<typeof import("../components/Skeleton.vue").default>
export const LazySlideCaptcha: LazyComponent<typeof import("../components/SlideCaptcha.vue").default>
export const LazyThirdPartyCaptcha: LazyComponent<typeof import("../components/ThirdPartyCaptcha.vue").default>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue").default>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout").default>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue").default>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only").default>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only").default>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder").default>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link").default>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator").default>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue").default>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer").default>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtImg>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtPicture>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page").default>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").NoScript>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Link>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Base>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Title>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Meta>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Style>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Head>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Html>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Body>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island").default>

export const componentNames: string[]

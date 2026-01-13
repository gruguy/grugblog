
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

interface _GlobalComponents {
  'ArticleCard': typeof import("../../components/ArticleCard.vue").default
  'Badge': typeof import("../../components/Badge.vue").default
  'Banner': typeof import("../../components/Banner.vue").default
  'Button': typeof import("../../components/Button.vue").default
  'Comment': typeof import("../../components/Comment.vue").default
  'DragCaptcha': typeof import("../../components/DragCaptcha.vue").default
  'Empty': typeof import("../../components/Empty.vue").default
  'GitHubStyleCalendar': typeof import("../../components/GitHubStyleCalendar.vue").default
  'ImagePicker': typeof import("../../components/ImagePicker.vue").default
  'MarkdownAnchor': typeof import("../../components/MarkdownAnchor.vue").default
  'Message': typeof import("../../components/Message.vue").default
  'Modal': typeof import("../../components/Modal.vue").default
  'Popup': typeof import("../../components/Popup.vue").default
  'PuzzleCaptcha': typeof import("../../components/PuzzleCaptcha.vue").default
  'Skeleton': typeof import("../../components/Skeleton.vue").default
  'SlideCaptcha': typeof import("../../components/SlideCaptcha.vue").default
  'ThirdPartyCaptcha': typeof import("../../components/ThirdPartyCaptcha.vue").default
  'NuxtWelcome': typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue").default
  'NuxtLayout': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout").default
  'NuxtErrorBoundary': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue").default
  'ClientOnly': typeof import("../../node_modules/nuxt/dist/app/components/client-only").default
  'DevOnly': typeof import("../../node_modules/nuxt/dist/app/components/dev-only").default
  'ServerPlaceholder': typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder").default
  'NuxtLink': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link").default
  'NuxtLoadingIndicator': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator").default
  'NuxtTime': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue").default
  'NuxtRouteAnnouncer': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer").default
  'NuxtImg': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtImg
  'NuxtPicture': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtPicture
  'NuxtPage': typeof import("../../node_modules/nuxt/dist/pages/runtime/page").default
  'NoScript': typeof import("../../node_modules/nuxt/dist/head/runtime/components").NoScript
  'Link': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Link
  'Base': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Base
  'Title': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Title
  'Meta': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Meta
  'Style': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Style
  'Head': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Head
  'Html': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Html
  'Body': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Body
  'NuxtIsland': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island").default
  'LazyArticleCard': LazyComponent<typeof import("../../components/ArticleCard.vue").default>
  'LazyBadge': LazyComponent<typeof import("../../components/Badge.vue").default>
  'LazyBanner': LazyComponent<typeof import("../../components/Banner.vue").default>
  'LazyButton': LazyComponent<typeof import("../../components/Button.vue").default>
  'LazyComment': LazyComponent<typeof import("../../components/Comment.vue").default>
  'LazyDragCaptcha': LazyComponent<typeof import("../../components/DragCaptcha.vue").default>
  'LazyEmpty': LazyComponent<typeof import("../../components/Empty.vue").default>
  'LazyGitHubStyleCalendar': LazyComponent<typeof import("../../components/GitHubStyleCalendar.vue").default>
  'LazyImagePicker': LazyComponent<typeof import("../../components/ImagePicker.vue").default>
  'LazyMarkdownAnchor': LazyComponent<typeof import("../../components/MarkdownAnchor.vue").default>
  'LazyMessage': LazyComponent<typeof import("../../components/Message.vue").default>
  'LazyModal': LazyComponent<typeof import("../../components/Modal.vue").default>
  'LazyPopup': LazyComponent<typeof import("../../components/Popup.vue").default>
  'LazyPuzzleCaptcha': LazyComponent<typeof import("../../components/PuzzleCaptcha.vue").default>
  'LazySkeleton': LazyComponent<typeof import("../../components/Skeleton.vue").default>
  'LazySlideCaptcha': LazyComponent<typeof import("../../components/SlideCaptcha.vue").default>
  'LazyThirdPartyCaptcha': LazyComponent<typeof import("../../components/ThirdPartyCaptcha.vue").default>
  'LazyNuxtWelcome': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue").default>
  'LazyNuxtLayout': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout").default>
  'LazyNuxtErrorBoundary': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue").default>
  'LazyClientOnly': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/client-only").default>
  'LazyDevOnly': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/dev-only").default>
  'LazyServerPlaceholder': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder").default>
  'LazyNuxtLink': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link").default>
  'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator").default>
  'LazyNuxtTime': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue").default>
  'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer").default>
  'LazyNuxtImg': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtImg>
  'LazyNuxtPicture': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtPicture>
  'LazyNuxtPage': LazyComponent<typeof import("../../node_modules/nuxt/dist/pages/runtime/page").default>
  'LazyNoScript': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").NoScript>
  'LazyLink': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Link>
  'LazyBase': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Base>
  'LazyTitle': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Title>
  'LazyMeta': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Meta>
  'LazyStyle': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Style>
  'LazyHead': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Head>
  'LazyHtml': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Html>
  'LazyBody': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Body>
  'LazyNuxtIsland': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island").default>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}

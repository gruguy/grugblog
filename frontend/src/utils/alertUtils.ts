import { ref, createApp, defineComponent, h } from 'vue'
import Modal from '@/components/Modal.vue'
import Message from '@/components/Message.vue'

// 创建Message实例
let messageInstance: any = null
const initMessageInstance = () => {
  if (!messageInstance) {
    const MessageContainer = defineComponent({
      render() {
        return h(Message, { ref: 'messageRef' })
      }
    })
    const app = createApp(MessageContainer)
    const container = document.createElement('div')
    document.body.appendChild(container)
    const vm = app.mount(container)
    messageInstance = vm.$refs.messageRef
  }
}

// 消息提示工具
export const message = {
  success(content: string, options?: any) {
    initMessageInstance()
    return messageInstance.addMessage({ type: 'success', content, ...options })
  },
  error(content: string, options?: any) {
    initMessageInstance()
    return messageInstance.addMessage({ type: 'error', content, ...options })
  },
  warning(content: string, options?: any) {
    initMessageInstance()
    return messageInstance.addMessage({ type: 'warning', content, ...options })
  },
  info(content: string, options?: any) {
    initMessageInstance()
    return messageInstance.addMessage({ type: 'info', content, ...options })
  },
  close(id: number) {
    if (messageInstance) {
      messageInstance.removeMessage(id)
    }
  }
}

// 替换原生alert
export const alert = (content: string, title = '提示') => {
  return new Promise<void>((resolve) => {
    const AlertModal = defineComponent({
      setup() {
        const visible = ref(true)
        
        const handleClose = () => {
          visible.value = false
          setTimeout(() => {
            app.unmount()
            document.body.removeChild(container)
            resolve()
          }, 300)
        }
        
        return () => h(Modal, {
          modelValue: visible.value,
          'onUpdate:modelValue': (val: boolean) => visible.value = val,
          title,
          onClose: handleClose
        }, {
          default: () => h('div', { class: 'py-4' }, content),
          footer: () => h('button', {
            onClick: handleClose,
            class: 'px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors'
          }, '确定')
        })
      }
    })
    
    const app = createApp(AlertModal)
    const container = document.createElement('div')
    document.body.appendChild(container)
    app.mount(container)
  })
}

// 替换原生prompt
export const prompt = (content: string, defaultValue = '', title = '提示') => {
  return new Promise<string | null>((resolve) => {
    const PromptModal = defineComponent({
      setup() {
        const visible = ref(true)
        const inputValue = ref(defaultValue)
        
        const handleCancel = () => {
          visible.value = false
          setTimeout(() => {
            app.unmount()
            document.body.removeChild(container)
            resolve(null)
          }, 300)
        }
        
        const handleConfirm = () => {
          visible.value = false
          setTimeout(() => {
            app.unmount()
            document.body.removeChild(container)
            resolve(inputValue.value)
          }, 300)
        }
        
        return () => h(Modal, {
          modelValue: visible.value,
          'onUpdate:modelValue': (val: boolean) => visible.value = val,
          title,
          onClose: handleCancel
        }, {
          default: () => h('div', { class: 'space-y-4' }, [
            h('div', content),
            h('input', {
              type: 'text',
              value: inputValue.value,
              onInput: (e: Event) => inputValue.value = (e.target as HTMLInputElement).value,
              class: 'w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
              onKeydown: (e: KeyboardEvent) => {
                if (e.key === 'Enter') {
                  handleConfirm()
                }
              }
            })
          ]),
          footer: () => h('div', { class: 'flex gap-3' }, [
            h('button', {
              onClick: handleCancel,
              class: 'px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors'
            }, '取消'),
            h('button', {
              onClick: handleConfirm,
              class: 'px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors'
            }, '确定')
          ])
        })
      }
    })
    
    const app = createApp(PromptModal)
    const container = document.createElement('div')
    document.body.appendChild(container)
    app.mount(container)
  })
}

// 确认弹窗
export const confirm = (content: string, title = '确认', options?: {
  confirmText?: string
  cancelText?: string
}) => {
  return new Promise<boolean>((resolve) => {
    const ConfirmModal = defineComponent({
      setup() {
        const visible = ref(true)
        
        const handleCancel = () => {
          visible.value = false
          setTimeout(() => {
            app.unmount()
            document.body.removeChild(container)
            resolve(false)
          }, 300)
        }
        
        const handleConfirm = () => {
          visible.value = false
          setTimeout(() => {
            app.unmount()
            document.body.removeChild(container)
            resolve(true)
          }, 300)
        }
        
        return () => h(Modal, {
          modelValue: visible.value,
          'onUpdate:modelValue': (val: boolean) => visible.value = val,
          title,
          onClose: handleCancel
        }, {
          default: () => h('div', { class: 'py-4' }, content),
          footer: () => h('div', { class: 'flex gap-3' }, [
            h('button', {
              onClick: handleCancel,
              class: 'px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors'
            }, options?.cancelText || '取消'),
            h('button', {
              onClick: handleConfirm,
              class: 'px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors'
            }, options?.confirmText || '确认')
          ])
        })
      }
    })
    
    const app = createApp(ConfirmModal)
    const container = document.createElement('div')
    document.body.appendChild(container)
    app.mount(container)
  })
}
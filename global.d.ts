export {}

declare global {
  interface Window {
    gtranslateSettings: {
      default_language: string
      native_language_names: boolean
      languages: string[]
      globe_color: string
      globe_size: number
      flag_size: number
      wrapper_selector: string
      horizontal_position: string
      vertical_position: string
    }
  }
}

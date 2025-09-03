export {}

declare global {
  interface Uni {
    $u: {
      route: (url: string, params?: any) => void
      toast: (title: string) => void
    }
  }
}

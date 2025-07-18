import { vi } from 'vitest'

globalThis.$t = (key) => key

globalThis.matchMedia = vi.fn().mockImplementation((query) => ({
     matches: false,
     media: query,
     addEventListener: vi.fn(),
     removeEventListener: vi.fn(),
     dispatchEvent: vi.fn(),
}))

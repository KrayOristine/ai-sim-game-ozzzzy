export {};

declare global {
  interface ParsedTag {
    tagName: string;
    params: Record<string, any>;
  }
}

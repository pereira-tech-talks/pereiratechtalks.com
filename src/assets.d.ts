declare module '*.svg' {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const content: any;
  export default content;
}

declare module '*.png' {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const value: any;
  export = value;
}

declare module '*.mp3' {
  const src: string;
  export default src;
}

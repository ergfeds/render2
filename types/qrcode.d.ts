declare module 'qrcode' {
  interface QRCodeOptions {
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    type?: string;
    quality?: number;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
    width?: number;
  }

  interface QRCodeMatrix {
    modules: boolean[][];
    version: number;
  }

  function create(text: string, options?: QRCodeOptions): Promise<QRCodeMatrix>;
  function toCanvas(canvasElement: HTMLCanvasElement, text: string, options?: QRCodeOptions): Promise<HTMLCanvasElement>;
  function toDataURL(text: string, options?: QRCodeOptions): Promise<string>;
  function toString(text: string, options?: QRCodeOptions): Promise<string>;

  export { create, toCanvas, toDataURL, toString };
  export default { create, toCanvas, toDataURL, toString };
}
// html2pdf.d.ts
declare module 'html2pdf.js' {
    function from(element: HTMLElement): {
      save: (filename: string) => void;
    };
    export = from;
  }
  
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'


// Note: font imports must not be used in _document.tsx (next/font restriction)


export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
    <Html lang="en" dir='ltr'>
        <Head />
         <body className="antialiased bg-gray-50" style={{ backgroundColor: "var(--color-gray-50)" }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

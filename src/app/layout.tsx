import "./globals.css";
import {Providers} from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <head>
          <script src="https://unpkg.com/react-scan/dist/auto.global.js" async />
        </head>
        <body>
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
  );
}

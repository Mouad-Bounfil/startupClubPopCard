import "@/styles/globals.css";
import "@/styles/styles.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import Head from "next/head";
import axios from "axios";
import { Toaster } from "@/components/ui/toaster"

import jwt from "jsonwebtoken"; 


axios.defaults.baseURL = "https://api.startupsquare.co/api/v3/";
const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoicG9wY2FyZC1zdGFydHVwc3F1YXJlIiwiaWF0IjoxNzA1ODc3NjQ2fQ.gZh7QeQYyNDjALPNTUQJTmt7LNUPnds_5YL5bIVB9JU";

axios.defaults.headers.common["x-api-key"] = apiKey;

export default function App({ Component, pageProps }: AppProps) {
  <Head>
    <title>My page</title>
    <meta
      name="viewport"
      content="minimum-scale=1, initial-scale=1, width=device-width"
    />
  </Head>;
  return (
    <SWRConfig
      value={{ fetcher: (url: string) => axios(url).then((r) => r.data) }}
    >
      <Component {...pageProps} />
      <Toaster />
    </SWRConfig>
  );
}

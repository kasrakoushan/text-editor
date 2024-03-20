import { PlainEditor } from '@/app/PlainEditor'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Page Title',
}

export default function Page() {
  return <div>
    <PlainEditor></PlainEditor>
  </div>
}

/**
 * 
 * import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { PlainEditor } from "@/components/PlainEditor";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return <div>
    <PlainEditor></PlainEditor>
  </div>
}

 */
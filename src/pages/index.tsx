import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Editor } from "@/components/Editor";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return <div>
    <h1>my text editor</h1>
    <Editor></Editor>
  </div>
}

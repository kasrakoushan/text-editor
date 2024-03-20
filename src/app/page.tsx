import { PlainEditor } from '@/app/PlainEditor'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'silly text editor',
}

export default function Page() {
  return <div>
    <PlainEditor></PlainEditor>
  </div>
}
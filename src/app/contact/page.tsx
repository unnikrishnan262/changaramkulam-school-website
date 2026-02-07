import dynamic from 'next/dynamic'

const ContactClient = dynamic(() => import('./ContactClient'), { ssr: false })

export default function ContactPage() {
  return <ContactClient />
}

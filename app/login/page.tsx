import { GalleryVerticalEnd } from "lucide-react"
import Image from "next/image"
import { LoginForm } from "../../components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh h-svh lg:grid-cols-[3fr_2fr]">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            DevPulse
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block overflow-hidden">
        <Image
          src="/Devpulse.png"
          alt="Login Background"
          fill
          className="object-cover object-bottom dark:brightness-[0.9] dark:grayscale"
        />
      </div>
    </div>
  )
}

import { Phone, Play, Boxes } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface WhyChooseUsProps {
  title?: string
  subtitle?: string
  backgroundImage?: string
  supportCard?: {
    title: string
    description: string
    phone: string
  }
}

export default function WhyChooseUs({
  title = "WHY CHOOSE US",
  subtitle = "We Provide Outsourced IT Services\nFor your business",
  backgroundImage = "/placeholder.svg?height=800&width=1600",
  supportCard = {
    title: "24/7 Customer support",
    description: "Gravity letters it amongst herself dearest an windows by. Wooded ladies she basket season age her uneasy saw. Discourse unwilling am no described dejection incommode no.",
    phone: "+123 456 7890"
  }
}: WhyChooseUsProps) {
  return (
    <section className="relative">
      {/* Top Wave */}
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto fill-white">
          <path d="M0,0 C480,120 960,120 1440,0 L1440,0 L0,0 Z" />
        </svg>
      </div>

      {/* Main Content */}
      <div 
        className="relative py-32 flex flex-col items-center justify-center min-h-[600px]"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white mb-16">
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          <h3 className="text-4xl font-bold whitespace-pre-line">{subtitle}</h3>
          
          <Button
            size="icon"
            variant="outline"
            className="mt-8 rounded-full w-16 h-16 border-2 border-white text-white hover:bg-white hover:text-black transition-colors"
          >
            <Play className="w-8 h-8 text-[#f26649]" />
          </Button>
        </div>

        {/* Cards */}
        <div className="relative z-10 container mx-auto px-4 mt-22">
          <div className="grid md:grid-cols-2 gap-8 -mb-32">
            {/* Support Card */}
            <Card className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow" >
              <CardHeader>
                <CardTitle className="text-2xl">{supportCard.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6 ">
                  {supportCard.description}
                </p>
                <div className="flex items-center gap-3 text-[#0066FF]">
                  <Phone className="h-5 w-5" />
                  <div>
                    <div className="font-semibold uppercase text-sm">Helpline</div>
                    <div>{supportCard.phone}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Smart Solutions Card */}
            <Card className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">Smart solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Gravity letters it amongst herself dearest an windows by. Wooded ladies she basket season age her uneasy saw. Discourse unwilling am no described dejection incommode no.
                </p>
                <div className="flex items-center gap-3">
                  <Boxes className="h-8 w-8 text-[#0066FF]" />
                  <Button
                    variant="link"
                    className="text-[#0066FF] hover:text-[#0052CC] p-0 h-auto font-semibold"
                  >
                    START NOW
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="bg-white h-32" />
    </section>
  )
}


import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Beaker, Heart, Activity, Droplet, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto py-10 px-4">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Medical Infusion Calculators</h1>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
          Precise dosage calculations for critical care medications
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Octreotide Calculator */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
              <Beaker className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>Octreotide</CardTitle>
            <CardDescription>Calculate octreotide infusion rates and dosages</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Manage dosing for gastrointestinal bleeding, hormone-secreting tumors, and other conditions requiring
              octreotide therapy.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/calculators/octreotide" className="w-full">
              <Button className="w-full">
                Open Calculator
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Dobutamine Calculator */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
              <Heart className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>Dobutamine</CardTitle>
            <CardDescription>Calculate dobutamine infusion rates and dosages</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Manage inotropic support for heart failure, cardiogenic shock, and other conditions requiring cardiac
              output enhancement.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/calculators/dobutamine" className="w-full">
              <Button className="w-full">
                Open Calculator
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Sodium Bicarbonate Calculator */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
              <Beaker className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle>Sodium Bicarbonate</CardTitle>
            <CardDescription>Calculate SBC infusion rates for metabolic acidosis</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Manage correction of metabolic acidosis with precise sodium bicarbonate dosing calculations.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/calculators/sbc" className="w-full">
              <Button className="w-full">
                Open Calculator
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Noradrenaline Calculator */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
              <Activity className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle>Noradrenaline</CardTitle>
            <CardDescription>Calculate noradrenaline infusion rates and dosages</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Manage vasopressor therapy for hypotension, septic shock, and other conditions requiring blood pressure
              support.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/calculators/noradrenaline" className="w-full">
              <Button className="w-full">
                Open Calculator
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Dopamine Calculator */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
              <Droplet className="h-6 w-6 text-amber-600" />
            </div>
            <CardTitle>Dopamine</CardTitle>
            <CardDescription>Calculate dopamine infusion rates and dosages</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Manage dosing for shock, heart failure, and other conditions requiring dopaminergic support.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/calculators/dopamine" className="w-full">
              <Button className="w-full">
                Open Calculator
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

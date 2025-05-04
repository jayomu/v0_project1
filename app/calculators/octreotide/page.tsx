import OctreotideCalculator from "@/components/calculators/octreotide-calculator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function OctreotidePage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Calculators
          </Button>
        </Link>
      </div>
      <OctreotideCalculator />
    </div>
  )
}

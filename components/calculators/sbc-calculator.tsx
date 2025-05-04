"use client"

import { useState } from "react"

const SBCCalculator = () => {
  // Constants
  const SBC_CONCENTRATION = 595 // in mmol/L (Sodium Bicarbonate concentration per liter)
  const AMPULE_SIZE_ML = 10 // Each ampule is 10 mL
  const SBC_PER_AMPULE = SBC_CONCENTRATION * (AMPULE_SIZE_ML / 1000) // mmol of HCO3 per ampule

  // State for user inputs
  const [weight, setWeight] = useState("")
  const [targetHCO3, setTargetHCO3] = useState("")
  const [currentHCO3, setCurrentHCO3] = useState("18")
  const [dropsPerML, setDropsPerML] = useState("16")
  const [results, setResults] = useState(null)
  const [error, setError] = useState("")
  const [showInfo, setShowInfo] = useState(false)

  const calculateSBC = () => {
    // Reset error state
    setError("")

    // Validation
    if (!weight || !targetHCO3) {
      setError("Please fill in all required fields")
      return
    }

    const weightValue = Number.parseFloat(weight)
    const targetHCO3Value = Number.parseFloat(targetHCO3)
    const currentHCO3Value = Number.parseFloat(currentHCO3 || "18")
    const dropsPerMLValue = Number.parseFloat(dropsPerML || "16")

    // Additional validation
    if (weightValue <= 0) {
      setError("Weight must be greater than 0")
      return
    }

    if (targetHCO3Value <= currentHCO3Value) {
      setError("Target HCO3 must be greater than current HCO3")
      return
    }

    // Calculate bicarbonate deficit
    const bicarbDeficit = 0.5 * weightValue * (targetHCO3Value - currentHCO3Value) // in mEq
    const requiredSBCMmol = bicarbDeficit // 1 mmol = 1 mEq for HCO3-
    const requiredSBCML = (requiredSBCMmol / SBC_CONCENTRATION) * 1000 // Convert mmol to mL
    const requiredAmpules = requiredSBCML / AMPULE_SIZE_ML

    // Infusion rates for undiluted SBC
    const first4HrsSBC = requiredSBCML / 2 // 50% in the first 4 hours
    const first4HrsRateUndiluted = first4HrsSBC / 4 // mL/hr
    const next20HrsSBC = requiredSBCML / 2 // Remaining 50%
    const next20HrsRateUndiluted = next20HrsSBC / 20 // mL/hr

    // Infusion rate if diluted in 500 cc D5%
    const totalFirst4HrsVolumeD5 = first4HrsSBC + 500 // Total volume (500 mL D5% + SBC)
    const first4HrsRateDiluted = totalFirst4HrsVolumeD5 / 4 // mL/hr
    const totalNext20HrsVolumeD5 = next20HrsSBC + 500 // Total volume (500 mL D5% + SBC)
    const next20HrsRateDiluted = totalNext20HrsVolumeD5 / 20 // mL/hr

    // Drip rates
    const first4HrsDropsPerMin = (first4HrsRateDiluted * dropsPerMLValue) / 60 // drops/min
    const next20HrsDropsPerMin = (next20HrsRateDiluted * dropsPerMLValue) / 60 // drops/min

    // Calculate two-bag option (one bag for first 4 hours, one bag for next 20 hours)
    // First bag (first 4 hours)
    const firstBagSBCVolume = requiredSBCML / 2 // 50% of SBC requirement
    const firstBagD5Volume = 500 - firstBagSBCVolume > 0 ? 500 - firstBagSBCVolume : 0
    const firstBagTotalVolume = Math.min(firstBagSBCVolume + firstBagD5Volume, 500) // Cap at 500mL
    const firstBagRate = firstBagTotalVolume / 4 // Rate for first 4 hours
    const firstBagDrops = (firstBagRate * dropsPerMLValue) / 60

    // Second bag (next 20 hours)
    const secondBagSBCVolume = requiredSBCML / 2 // Remaining 50% of SBC requirement
    const secondBagD5Volume = 500 - secondBagSBCVolume > 0 ? 500 - secondBagSBCVolume : 0
    const secondBagTotalVolume = Math.min(secondBagSBCVolume + secondBagD5Volume, 500) // Cap at 500mL
    const secondBagRate = secondBagTotalVolume / 20 // Rate for next 20 hours
    const secondBagDrops = (secondBagRate * dropsPerMLValue) / 60

    // Set results
    setResults({
      bicarbDeficit: bicarbDeficit.toFixed(2),
      requiredSBCML: requiredSBCML.toFixed(2),
      requiredAmpules: requiredAmpules.toFixed(2),
      first4HrsRateUndiluted: first4HrsRateUndiluted.toFixed(2),
      next20HrsRateUndiluted: next20HrsRateUndiluted.toFixed(2),
      first4HrsRateDiluted: first4HrsRateDiluted.toFixed(2),
      next20HrsRateDiluted: next20HrsRateDiluted.toFixed(2),
      first4HrsDropsPerMin: first4HrsDropsPerMin.toFixed(2),
      next20HrsDropsPerMin: next20HrsDropsPerMin.toFixed(2),
      first4HrsSBCVolume: (requiredSBCML / 2).toFixed(2),
      next20HrsSBCVolume: (requiredSBCML / 2).toFixed(2),
      totalFirst4HrsVolume: (requiredSBCML / 2 + 500).toFixed(2),
      totalNext20HrsVolume: (requiredSBCML / 2 + 500).toFixed(2),
      // Two separate 500cc bags option
      firstBagSBCVolume: firstBagSBCVolume.toFixed(2),
      firstBagD5Volume: firstBagD5Volume.toFixed(2),
      firstBagTotalVolume: firstBagTotalVolume.toFixed(2),
      firstBagRate: firstBagRate.toFixed(2),
      firstBagDrops: firstBagDrops.toFixed(2),
      secondBagSBCVolume: secondBagSBCVolume.toFixed(2),
      secondBagD5Volume: secondBagD5Volume.toFixed(2),
      secondBagTotalVolume: secondBagTotalVolume.toFixed(2),
      secondBagRate: secondBagRate.toFixed(2),
      secondBagDrops: secondBagDrops.toFixed(2),
    })
  }

  const resetForm = () => {
    setWeight("")
    setTargetHCO3("")
    setCurrentHCO3("18")
    setDropsPerML("16")
    setResults(null)
    setError("")
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Sodium Bicarbonate Infusion Calculator</h1>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold py-1 px-3 rounded-full text-sm focus:outline-none focus:shadow-outline"
        >
          {showInfo ? "Hide Info" : "Info"}
        </button>
      </div>

      {showInfo && (
        <div className="bg-blue-50 p-4 rounded-lg mb-4 text-sm">
          <h3 className="font-bold text-blue-700 mb-2">About This Calculator</h3>
          <p className="mb-2">This calculator uses the following formula to determine bicarbonate deficit:</p>
          <p className="font-mono bg-white p-2 rounded mb-3">
            HCO3- deficit (mEq) = 0.5 × weight (kg) × (target HCO3- - current HCO3-)
          </p>
          <p className="mb-2">The standard SBC concentration used is 595 mmol/L with 10 mL ampules.</p>
          <p className="mb-2">For metabolic acidosis, the infusion is typically divided:</p>
          <ul className="list-disc list-inside mb-3">
            <li>50% of calculated dose in first 4 hours</li>
            <li>Remaining 50% over the next 20 hours</li>
          </ul>
          <p className="mb-2">
            <span className="font-bold">Administration Options:</span>
          </p>
          <ul className="list-disc list-inside">
            <li>
              <span className="font-medium">Undiluted:</span> Direct SBC administration (rarely used)
            </li>
            <li>
              <span className="font-medium">Diluted in D5%:</span> SBC added to two 500cc D5% bags - one for first 4hrs,
              one for next 20hrs
            </li>
            <li>
              <span className="font-medium">Two-Bag 500cc Option:</span> Two separate 500cc bags with proper SBC:D5%
              ratio for each time period
            </li>
          </ul>
          <p className="mt-2 text-red-600 font-semibold">
            Note: This calculator is for reference only. Always follow your institution's protocols and physician
            orders.
          </p>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="weight">
              Patient's Weight (kg)*
            </label>
            <input
              id="weight"
              type="number"
              step="0.1"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="targetHCO3">
              Target HCO3 (mEq/L)*
            </label>
            <input
              id="targetHCO3"
              type="number"
              step="0.1"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={targetHCO3}
              onChange={(e) => setTargetHCO3(e.target.value)}
              placeholder="Enter target HCO3"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentHCO3">
              Current HCO3 (mEq/L)
            </label>
            <input
              id="currentHCO3"
              type="number"
              step="0.1"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={currentHCO3}
              onChange={(e) => setCurrentHCO3(e.target.value)}
              placeholder="Default: 18"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dropsPerML">
              Infusion Set Drop Factor (drops/mL)
            </label>
            <select
              id="dropsPerML"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={dropsPerML}
              onChange={(e) => setDropsPerML(e.target.value)}
            >
              <option value="10">10 drops/mL (Macrodrip)</option>
              <option value="15">15 drops/mL (Macrodrip)</option>
              <option value="16">16 drops/mL (Macrodrip - Standard)</option>
              <option value="20">20 drops/mL (Macrodrip)</option>
              <option value="60">60 drops/mL (Microdrip)</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4">
            <p>{error}</p>
          </div>
        )}

        <div className="flex justify-center mt-4 space-x-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={calculateSBC}
          >
            Calculate
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={resetForm}
          >
            Reset
          </button>
        </div>
      </div>

      {results && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-center text-blue-700">Calculation Results</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold text-blue-700 border-b pb-2 mb-3">Deficit & Required SBC</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">HCO3- Deficit:</span> {results.bicarbDeficit} mEq
                </p>
                <p>
                  <span className="font-semibold">Required SBC:</span> {results.requiredSBCML} mL
                </p>
                <p>
                  <span className="font-semibold">Ampules Needed:</span> {results.requiredAmpules} x 10mL ampules
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold text-blue-700 border-b pb-2 mb-3">Undiluted Administration</h3>
              <div className="space-y-1">
                <p className="font-semibold text-blue-600">First 4 hours (50%)</p>
                <p>
                  <span className="font-medium">Volume:</span> {results.first4HrsSBCVolume} mL SBC
                </p>
                <p>
                  <span className="font-medium">Rate:</span> {results.first4HrsRateUndiluted} mL/hr
                </p>

                <p className="font-semibold text-blue-600 mt-3">Next 20 hours (50%)</p>
                <p>
                  <span className="font-medium">Volume:</span> {results.next20HrsSBCVolume} mL SBC
                </p>
                <p>
                  <span className="font-medium">Rate:</span> {results.next20HrsRateUndiluted} mL/hr
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold text-blue-700 border-b pb-2 mb-3">Two-Bag 500cc Option</h3>
              <div className="space-y-1">
                <p className="font-semibold text-blue-600">Bag 1 (First 4 hours)</p>
                <p>
                  <span className="font-medium">Mix:</span> {results.firstBagSBCVolume} mL SBC +{" "}
                  {results.firstBagD5Volume} mL D5%
                </p>
                <p>
                  <span className="font-medium">Total Volume:</span> {results.firstBagTotalVolume} mL
                </p>
                <p>
                  <span className="font-medium">Rate:</span> {results.firstBagRate} mL/hr
                </p>
                <p>
                  <span className="font-medium">Drops:</span> {results.firstBagDrops} drops/min
                </p>

                <p className="font-semibold text-blue-600 mt-3">Bag 2 (Next 20 hours)</p>
                <p>
                  <span className="font-medium">Mix:</span> {results.secondBagSBCVolume} mL SBC +{" "}
                  {results.secondBagD5Volume} mL D5%
                </p>
                <p>
                  <span className="font-medium">Total Volume:</span> {results.secondBagTotalVolume} mL
                </p>
                <p>
                  <span className="font-medium">Rate:</span> {results.secondBagRate} mL/hr
                </p>
                <p>
                  <span className="font-medium">Drops:</span> {results.secondBagDrops} drops/min
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold text-blue-700 border-b pb-2 mb-3">Diluted in 500cc D5%</h3>
              <div className="space-y-1">
                <p className="font-semibold text-blue-600">First 4 hours (50%)</p>
                <p>
                  <span className="font-medium">Mix:</span> {results.first4HrsSBCVolume} mL SBC + 500 mL D5%
                </p>
                <p>
                  <span className="font-medium">Total Volume:</span> {results.totalFirst4HrsVolume} mL
                </p>
                <p>
                  <span className="font-medium">Rate:</span> {results.first4HrsRateDiluted} mL/hr
                </p>
                <p>
                  <span className="font-medium">Drops:</span> {results.first4HrsDropsPerMin} drops/min
                </p>

                <p className="font-semibold text-blue-600 mt-3">Next 20 hours (50%)</p>
                <p>
                  <span className="font-medium">Mix:</span> {results.next20HrsSBCVolume} mL SBC + 500 mL D5%
                </p>
                <p>
                  <span className="font-medium">Total Volume:</span> {results.totalNext20HrsVolume} mL
                </p>
                <p>
                  <span className="font-medium">Rate:</span> {results.next20HrsRateDiluted} mL/hr
                </p>
                <p>
                  <span className="font-medium">Drops:</span> {results.next20HrsDropsPerMin} drops/min
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600">
        <p>* Required fields</p>
        <p className="mt-2">
          <strong>Disclaimer:</strong> This calculator is intended for reference only and should be used under the
          guidance of a healthcare professional. Always verify calculations and follow institutional protocols.
        </p>
      </div>
    </div>
  )
}

export default SBCCalculator

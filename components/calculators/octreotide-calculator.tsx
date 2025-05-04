"use client"

import { useState, useEffect } from "react"

const OctreotideCalculator = () => {
  // Default values
  const [octreotideMl, setOctreotideMl] = useState(5)
  const [octreotideMcg, setOctreotideMcg] = useState(500)
  const [diluentMl, setDiluentMl] = useState(45)
  const [totalSolution, setTotalSolution] = useState(50)
  const [weight, setWeight] = useState(60)
  const [rateSlider, setRateSlider] = useState(5)
  const [doseSlider, setDoseSlider] = useState(25) // For desired dose range
  const [manualRateInput, setManualRateInput] = useState("")

  // Calculate concentration in mcg/ml
  const [concentration, setConcentration] = useState(0)

  useEffect(() => {
    // Calculate concentration when inputs change
    const calculatedConcentration = octreotideMcg / totalSolution
    setConcentration(calculatedConcentration)
  }, [octreotideMcg, totalSolution])

  // Calculate mcg/hr based on rate in ml/hr
  const calculateMcgHr = (rateInMlHr) => {
    return rateInMlHr * concentration
  }

  // Calculate rate in ml/hr based on mcg/hr
  const calculateRateFromMcgHr = (mcgHr) => {
    if (concentration <= 0) return 0
    return mcgHr / concentration
  }

  // Update total solution when octreotideMl or diluentMl changes
  useEffect(() => {
    setTotalSolution(Number.parseFloat(octreotideMl) + Number.parseFloat(diluentMl))
  }, [octreotideMl, diluentMl])

  // Format number to 2 decimal places
  const formatNumber = (num) => {
    return Math.round(num * 100) / 100
  }

  return (
    <div className="flex flex-col bg-gray-50 p-6 rounded-lg shadow-lg max-w-2xl mx-auto text-gray-800">
      <h1 className="text-2xl font-bold text-center text-blue-800 mb-6">Octreotide Infusion Calculator</h1>

      {/* Solution Preparation Section */}
      <div className="bg-white p-4 rounded-md shadow mb-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-700">Solution Preparation</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Octreotide (ml)</label>
            <input
              type="number"
              value={octreotideMl}
              onChange={(e) => setOctreotideMl(Number.parseFloat(e.target.value) || 0)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Octreotide (mcg)</label>
            <input
              type="number"
              value={octreotideMcg}
              onChange={(e) => setOctreotideMcg(Number.parseFloat(e.target.value) || 0)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Normal Saline (ml)</label>
            <input
              type="number"
              value={diluentMl}
              onChange={(e) => setDiluentMl(Number.parseFloat(e.target.value) || 0)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Total Solution (ml)</label>
            <input type="number" value={totalSolution} readOnly className="w-full p-2 border rounded-md bg-gray-100" />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Patient Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(Number.parseFloat(e.target.value) || 0)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mt-4 p-2 bg-blue-50 rounded-md">
          <p className="text-sm font-medium">
            Solution Concentration: <span className="font-bold">{formatNumber(concentration)} mcg/ml</span>
          </p>
        </div>
      </div>

      {/* Rate-based Calculation Section */}
      <div className="bg-white p-4 rounded-md shadow mb-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-700">Rate-based Calculation</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Infusion Rate (ml/hr): {formatNumber(rateSlider)}</label>
          <input
            type="range"
            min="0"
            max="20"
            step="0.1"
            value={rateSlider}
            onChange={(e) => setRateSlider(Number.parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="mt-2 p-2 bg-blue-50 rounded-md">
            <p className="text-sm">Dose:</p>
            <p className="font-bold text-lg">{formatNumber(calculateMcgHr(rateSlider))} mcg/hr</p>
          </div>
        </div>
      </div>

      {/* Dose-based Calculation Section */}
      <div className="bg-white p-4 rounded-md shadow mb-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-700">Dose-based Calculation</h2>

        {/* Desired dose range (25-50 mcg/hr) */}
        <div className="mb-6 p-3 bg-green-50 rounded-md">
          <h3 className="font-medium text-green-800 mb-2">Desired dose range (25-50 mcg/hr)</h3>
          <label className="block text-sm mb-1">Dose: {formatNumber(doseSlider)} mcg/hr</label>
          <input
            type="range"
            min="25"
            max="50"
            step="1"
            value={doseSlider}
            onChange={(e) => setDoseSlider(Number.parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="mt-2 p-2 bg-white rounded-md text-center">
            <p className="text-sm">Required Infusion Rate:</p>
            <p className="font-bold text-xl text-green-700">{formatNumber(calculateRateFromMcgHr(doseSlider))} ml/hr</p>
          </div>
        </div>
      </div>

      {/* Manual Rate Input Section */}
      <div className="bg-white p-4 rounded-md shadow">
        <h2 className="text-lg font-semibold mb-3 text-blue-700">Manual Rate Input</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Enter Rate (ml/hr)</label>
          <input
            type="number"
            value={manualRateInput}
            onChange={(e) => setManualRateInput(Number.parseFloat(e.target.value) || 0)}
            className="w-full p-2 border rounded-md"
          />
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm">Dose:</p>
            <p className="font-bold text-lg">{formatNumber(calculateMcgHr(manualRateInput || 0))} mcg/hr</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OctreotideCalculator

"use client"

import { useState, useEffect } from "react"

export default function DopamineCalculator() {
  // Default values
  const [dopamineMl, setDopamineMl] = useState(20)
  const [dopamineMg, setDopamineMg] = useState(200)
  const [diluentMl, setDiluentMl] = useState(30)
  const [totalSolution, setTotalSolution] = useState(50)
  const [weight, setWeight] = useState(60)
  const [rateSlider, setRateSlider] = useState(5)
  const [lowRateSlider, setLowRateSlider] = useState(1.5)
  const [moderateRateSlider, setModerateRateSlider] = useState(5)
  const [highRateSlider, setHighRateSlider] = useState(15)
  const [manualRateInput, setManualRateInput] = useState("")

  // Calculate concentration in mg/ml
  const [concentration, setConcentration] = useState(0)

  useEffect(() => {
    // Calculate concentration when inputs change
    const calculatedConcentration = dopamineMg / totalSolution
    setConcentration(calculatedConcentration)
  }, [dopamineMg, totalSolution])

  // Calculate mcg/kg/min based on rate in ml/hr
  const calculateMcgKgMin = (rateInMlHr) => {
    if (weight <= 0) return 0
    // Formula: (rate (ml/hr) * concentration (mg/ml) * 1000) / (weight (kg) * 60)
    return (rateInMlHr * concentration * 1000) / (weight * 60)
  }

  // Calculate mcg/min based on rate in ml/hr
  const calculateMcgMin = (rateInMlHr) => {
    // Formula: (rate (ml/hr) * concentration (mg/ml) * 1000) / 60
    return (rateInMlHr * concentration * 1000) / 60
  }

  // Calculate rate in ml/hr based on mcg/kg/min
  const calculateRateFromMcgKgMin = (mcgKgMin) => {
    if (concentration <= 0 || weight <= 0) return 0
    // Formula: (mcg/kg/min * weight (kg) * 60) / (concentration (mg/ml) * 1000)
    return (mcgKgMin * weight * 60) / (concentration * 1000)
  }

  // Update total solution when dopamineMl or diluentMl changes
  useEffect(() => {
    setTotalSolution(Number.parseFloat(dopamineMl) + Number.parseFloat(diluentMl))
  }, [dopamineMl, diluentMl])

  // Format number to 2 decimal places
  const formatNumber = (num) => {
    return Math.round(num * 100) / 100
  }

  return (
    <div className="flex flex-col bg-gray-50 p-6 rounded-lg shadow-lg max-w-2xl mx-auto text-gray-800">
      <h1 className="text-2xl font-bold text-center text-blue-800 mb-6">Dopamine Infusion Calculator</h1>

      {/* Solution Preparation Section */}
      <div className="bg-white p-4 rounded-md shadow mb-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-700">Solution Preparation</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Dopamine (ml)</label>
            <input
              type="number"
              value={dopamineMl}
              onChange={(e) => setDopamineMl(Number.parseFloat(e.target.value) || 0)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Dopamine (mg)</label>
            <input
              type="number"
              value={dopamineMg}
              onChange={(e) => setDopamineMg(Number.parseFloat(e.target.value) || 0)}
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
            Solution Concentration: <span className="font-bold">{formatNumber(concentration)} mg/ml</span>
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
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="p-2 bg-blue-50 rounded-md">
              <p className="text-sm">Weight-based Dose:</p>
              <p className="font-bold text-lg">{formatNumber(calculateMcgKgMin(rateSlider))} mcg/kg/min</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-md">
              <p className="text-sm">Non-weight-based Dose:</p>
              <p className="font-bold text-lg">{formatNumber(calculateMcgMin(rateSlider))} mcg/min</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dose-based Calculation Section */}
      <div className="bg-white p-4 rounded-md shadow mb-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-700">Dose-based Calculation</h2>

        {/* Low-dose rate */}
        <div className="mb-6 p-3 bg-green-50 rounded-md">
          <h3 className="font-medium text-green-800 mb-2">Low Infusion Rate (0-3 mcg/kg/min)</h3>
          <label className="block text-sm mb-1">Dose: {formatNumber(lowRateSlider)} mcg/kg/min</label>
          <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={lowRateSlider}
            onChange={(e) => setLowRateSlider(Number.parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="mt-2 p-2 bg-white rounded-md text-center">
            <p className="text-sm">Required Infusion Rate:</p>
            <p className="font-bold text-xl text-green-700">
              {formatNumber(calculateRateFromMcgKgMin(lowRateSlider))} ml/hr
            </p>
          </div>
        </div>

        {/* Moderate-dose rate */}
        <div className="mb-6 p-3 bg-yellow-50 rounded-md">
          <h3 className="font-medium text-yellow-800 mb-2">Moderate Infusion Rate (3-10 mcg/kg/min)</h3>
          <label className="block text-sm mb-1">Dose: {formatNumber(moderateRateSlider)} mcg/kg/min</label>
          <input
            type="range"
            min="3"
            max="10"
            step="0.1"
            value={moderateRateSlider}
            onChange={(e) => setModerateRateSlider(Number.parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="mt-2 p-2 bg-white rounded-md text-center">
            <p className="text-sm">Required Infusion Rate:</p>
            <p className="font-bold text-xl text-yellow-700">
              {formatNumber(calculateRateFromMcgKgMin(moderateRateSlider))} ml/hr
            </p>
          </div>
        </div>

        {/* High-dose rate */}
        <div className="mb-4 p-3 bg-red-50 rounded-md">
          <h3 className="font-medium text-red-800 mb-2">High Infusion Rate (10-20 mcg/kg/min)</h3>
          <label className="block text-sm mb-1">Dose: {formatNumber(highRateSlider)} mcg/kg/min</label>
          <input
            type="range"
            min="10"
            max="20"
            step="0.1"
            value={highRateSlider}
            onChange={(e) => setHighRateSlider(Number.parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="mt-2 p-2 bg-white rounded-md text-center">
            <p className="text-sm">Required Infusion Rate:</p>
            <p className="font-bold text-xl text-red-700">
              {formatNumber(calculateRateFromMcgKgMin(highRateSlider))} ml/hr
            </p>
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
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-sm">Weight-based Dose:</p>
              <p className="font-bold text-lg">{formatNumber(calculateMcgKgMin(manualRateInput || 0))} mcg/kg/min</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-sm">Non-weight-based Dose:</p>
              <p className="font-bold text-lg">{formatNumber(calculateMcgMin(manualRateInput || 0))} mcg/min</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

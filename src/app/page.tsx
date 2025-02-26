"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

// Props type for URLParamsHandler
type URLParamsHandlerProps = {
  setInvestmentAmount: (value: number) => void;
  setValuationCap: (value: number) => void;
  setDiscountRate: (value: number) => void;
  setNewRoundValuation: (value: number) => void;
  setTermType: (value: string) => void;
};

const URLParamsHandler = ({
  setInvestmentAmount,
  setValuationCap,
  setDiscountRate,
  setNewRoundValuation,
  setTermType
}: URLParamsHandlerProps) => {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const investAmount = searchParams.get("invest");
    const valCap = searchParams.get("cap");
    const discount = searchParams.get("discount");
    const newVal = searchParams.get("newVal");
    const type = searchParams.get("type");
    
    if (investAmount) setInvestmentAmount(Number(investAmount));
    if (valCap) setValuationCap(Number(valCap));
    if (discount) setDiscountRate(Number(discount));
    if (newVal) setNewRoundValuation(Number(newVal));
    if (type) setTermType(type);
  }, [searchParams, setInvestmentAmount, setValuationCap, setDiscountRate, setNewRoundValuation, setTermType]);

  return null;
}

export default function Home() {
  // Term explanations
  const terms = {
    safe: "SAFE (Simple Agreement for Future Equity) is an investment instrument developed by Y Combinator...",
    valuation_cap: "A valuation cap sets the maximum valuation at which your investment converts to equity...",
    discount_rate: "A discount represents the reduced price at which your SAFE converts compared to what new investors pay...",
    pro_rata: "Pro-rata rights allow investors to maintain their ownership percentage in future funding rounds...",
    most_favored_nation: "MFN clause ensures that if the company issues SAFEs with better terms to later investors...",
  };

  // Define type for valid term keys
  type TermKey = keyof typeof terms;
  
  // State declarations
  const [investmentAmount, setInvestmentAmount] = useState(100000);
  const [valuationCap, setValuationCap] = useState(5000000);
  const [discountRate, setDiscountRate] = useState(20);
  const [newRoundValuation, setNewRoundValuation] = useState(10000000);
  const [termType, setTermType] = useState("cap");
  const [showExplanation, setShowExplanation] = useState(false);
  const [activeTermModal, setActiveTermModal] = useState<TermKey | "">("");

  // Calculate ownership percentage
  const calculateOwnership = () => {
    if (termType === "cap") {
      return (investmentAmount / valuationCap) * 100;
    } else if (termType === "discount") {
      return (investmentAmount / newRoundValuation) * 100; // Adjust as needed
    } else if (termType === "both") {
      const ownershipCap = (investmentAmount / valuationCap) * 100;
      const ownershipDiscount = (investmentAmount / newRoundValuation) * 100; // Adjust as needed
      return Math.max(ownershipCap, ownershipDiscount); // Choose the better option
    }
    return 0; // Default case
  };

  // Function to copy results to clipboard
  const copyLinkToClipboard = () => {
    const result = `Investment Amount: $${investmentAmount}, Valuation Cap: $${valuationCap}, Discount Rate: ${discountRate}%, Next Round Valuation: $${newRoundValuation}`;
    navigator.clipboard.writeText(result)
      .then(() => {
        alert("Results copied to clipboard!");
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Suspense fallback={<div>Loading params...</div>}>
          <URLParamsHandler 
            setInvestmentAmount={setInvestmentAmount}
            setValuationCap={setValuationCap}
            setDiscountRate={setDiscountRate}
            setNewRoundValuation={setNewRoundValuation}
            setTermType={setTermType}
          />
        </Suspense>

        <header className="bg-white dark:bg-gray-800 shadow-sm py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">SAFE Contract Calculator</h1>
            <button 
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-sm bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full"
            >
              {showExplanation ? "Hide Explanation" : "What is a SAFE?"}
            </button>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-8">
          {showExplanation && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8 animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">What is a SAFE Contract?</h2>
              <p className="mb-4">{terms.safe}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This calculator helps you understand how your SAFE investment might convert to equity 
                in a future financing round based on the terms you choose.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Calculator</h2>
                
                <div className="space-y-6">
                  {/* Investment Amount */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Investment Amount ($)
                    </label>
                    <input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  
                  {/* SAFE Type Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      SAFE Type
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="cap"
                          checked={termType === "cap"}
                          onChange={() => setTermType("cap")}
                          className="form-radio text-indigo-600"
                        />
                        <span className="ml-2">Valuation Cap</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="discount"
                          checked={termType === "discount"}
                          onChange={() => setTermType("discount")}
                          className="form-radio text-indigo-600"
                        />
                        <span className="ml-2">Discount</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="both"
                          checked={termType === "both"}
                          onChange={() => setTermType("both")}
                          className="form-radio text-indigo-600"
                        />
                        <span className="ml-2">Both</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Valuation Cap */}
                  {(termType === "cap" || termType === "both") && (
                    <div>
                      <div className="flex items-center">
                        <label className="block text-sm font-medium mb-2">
                          Valuation Cap ($)
                        </label>
                        <button 
                          onClick={() => setActiveTermModal("valuation_cap")}
                          className="ml-2 text-xs text-indigo-600 hover:underline"
                        >
                          Whats this?
                        </button>
                      </div>
                      <input
                        type="number"
                        value={valuationCap}
                        onChange={(e) => setValuationCap(Number(e.target.value))}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  )}
                  
                  {/* Discount Rate */}
                  {(termType === "discount" || termType === "both") && (
                    <div>
                      <div className="flex items-center">
                        <label className="block text-sm font-medium mb-2">
                          Discount Rate (%)
                        </label>
                        <button 
                          onClick={() => setActiveTermModal("discount_rate")}
                          className="ml-2 text-xs text-indigo-600 hover:underline"
                        >
                          Whats this?
                        </button>
                      </div>
                      <input
                        type="number"
                        value={discountRate}
                        onChange={(e) => setDiscountRate(Number(e.target.value))}
                        min="0"
                        max="100"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  )}
                  
                  {/* Future Valuation */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Next Round Valuation ($)
                    </label>
                    <input
                      type="number"
                      value={newRoundValuation}
                      onChange={(e) => setNewRoundValuation(Number(e.target.value))}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Results Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Results</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Ownership</h3>
                  <div className="mt-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                    {calculateOwnership().toFixed(2)}%
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Estimated equity percentage
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Investment Returns</h3>
                  <div className="mt-2">
                    <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                      ${(newRoundValuation * (calculateOwnership() / 100)).toLocaleString()}
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Estimated value at next round
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={copyLinkToClipboard}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Share Calculator Results
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Terminology Section */}
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold">SAFE Contract Terminology</h2>
            </div>
            <div className="px-6 py-5">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium cursor-pointer hover:text-indigo-600" 
                      onClick={() => setActiveTermModal("safe")}>
                    What is a SAFE?
                  </h3>
                </div>
                <div>
                  <h3 className="text-lg font-medium cursor-pointer hover:text-indigo-600"
                      onClick={() => setActiveTermModal("valuation_cap")}>
                    Valuation Cap
                  </h3>
                </div>
                <div>
                  <h3 className="text-lg font-medium cursor-pointer hover:text-indigo-600"
                      onClick={() => setActiveTermModal("discount_rate")}>
                    Discount Rate
                  </h3>
                </div>
                <div>
                  <h3 className="text-lg font-medium cursor-pointer hover:text-indigo-600"
                      onClick={() => setActiveTermModal("pro_rata")}>
                    Pro-Rata Rights
                  </h3>
                </div>
                <div>
                  <h3 className="text-lg font-medium cursor-pointer hover:text-indigo-600"
                      onClick={() => setActiveTermModal("most_favored_nation")}>
                    Most Favored Nation (MFN)
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
          <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>SAFE Contract Calculator - This tool is for educational purposes only and does not constitute legal or investment advice.</p>
          </div>
        </footer>
        
        {/* Term Definition Modal */}
        {activeTermModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">
                    {activeTermModal.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </h3>
                  <button onClick={() => setActiveTermModal("")} className="text-gray-400 hover:text-gray-500">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {terms[activeTermModal]}
                </p>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setActiveTermModal("")}
                    className="py-2 px-4 border border-transparent rounded-md text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Suspense>
  );
}
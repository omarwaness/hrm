import React from "react"
import ContractViewer from "./contract-viewer"


function Contract() {
  return (
    <div className="flex min-h-screen flex-col p-2">
      <div className="mx-auto w-full max-w-3xl space-y-6 py-10">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Employee Portal</h1>
          <p className="text-gray-500">View your employment contract below.</p>
        </div>

        <ContractViewer />
      </div>
    </div>
  )
}

export default Contract

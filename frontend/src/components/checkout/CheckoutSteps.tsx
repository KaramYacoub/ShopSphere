import type { CheckoutStepsProps } from "@/types/types";

export function CheckoutSteps({ step }: CheckoutStepsProps) {
  return (
    <div className="mb-8">
      {/* Mobile Steps */}
      <div className="sm:hidden flex items-center justify-between mb-4">
        {["Shipping", "Method", "Payment"].map((label, index) => {
          const stepNumber = index + 1;
          return (
            <div key={stepNumber} className="flex-1 text-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mx-auto transition-colors duration-500 ${
                  step >= stepNumber
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {stepNumber}
              </div>
              <span className="text-xs mt-1 block">{label}</span>
            </div>
          );
        })}
      </div>

      {/* Desktop Steps */}
      <div className="hidden sm:flex items-center justify-center mb-4">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-medium transition-colors duration-500 ${
                step === stepNumber
                  ? "bg-primary text-primary-foreground"
                  : step > stepNumber
                  ? "bg-green-500 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {stepNumber}
            </div>
            {stepNumber < 3 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  step > stepNumber ? "bg-green-500" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface YearlyContribution {
    yearNumber: number;
    total: number;
    principalValue: number;
  }
  
  export function calculateCompoundInterest(
    initialDeposit: number,
    annualContribution: number,
    yearsOfGrowth: number,
    rateOfReturn: number
  ): YearlyContribution[] {
    const contributions: YearlyContribution[] = [];
    let totalAmount = initialDeposit;
  
    for (let year = 1; year <= yearsOfGrowth; year++) {
      totalAmount += annualContribution;
      totalAmount += totalAmount * (rateOfReturn / 100);
      const principalValue = initialDeposit + annualContribution * year;
  
      contributions.push({
        yearNumber: year,
        total: parseFloat(totalAmount.toFixed(2)),
        principalValue: parseFloat(principalValue.toFixed(2)),
      });
    }
  
    return contributions;
  }
  
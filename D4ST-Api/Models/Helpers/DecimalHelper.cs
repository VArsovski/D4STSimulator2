using System;

namespace D4ST_Api.Models.Helpers
{
    public static class DecimalHelper
    {
        public static decimal RoundToDecimals(double value, int decimals) {
            return Math.Round(Convert.ToDecimal(value), decimals);
        }
        public static decimal RoundToDecimalsD(decimal value, int decimals) {
            return Math.Round(value, decimals);
        }        
    }
}

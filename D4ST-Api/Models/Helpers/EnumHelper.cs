using System;

namespace D4ST_Api.Models.Helpers
{
    public static class EnumHelper
    {
        public static string GetName<T>(T value) where T:Enum {
            return Enum.GetName(typeof(T), value);
        }
    }
}
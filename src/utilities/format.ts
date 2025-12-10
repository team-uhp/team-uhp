export function splitCamelCase(str: string): string {
// special case (ThreeDModeling --> 3D Modeling)
  const specialCases: Record<string, string> = {
    'ThreeD': '3D',
  };

  for (const key in specialCases) {
    if (str.includes(key)) {
      str = str.replace(key, specialCases[key]);
    }
  }

  return str.replace(/([a-z])([A-Z])/g, '$1 $2');
}

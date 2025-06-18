export default function FontTestPage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold mb-8">Font Loading Test</h1>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Font Family Tests</h2>
        
        <div className="p-4 border rounded">
          <h3 className="text-lg font-medium mb-2">Default (should use CustomFont)</h3>
          <p className="text-base">
            This text should be using the CustomFont family from the body font-custom class.
            The quick brown fox jumps over the lazy dog. 1234567890
          </p>
        </div>

        <div className="p-4 border rounded">
          <h3 className="text-lg font-medium mb-2">Explicit font-custom class</h3>
          <p className="text-base font-custom">
            This text explicitly uses the font-custom class.
            The quick brown fox jumps over the lazy dog. 1234567890
          </p>
        </div>

        <div className="p-4 border rounded">
          <h3 className="text-lg font-medium mb-2">Explicit font-heading class</h3>
          <p className="text-base font-heading">
            This text uses the font-heading class (Space Grotesk + CustomFont fallback).
            The quick brown fox jumps over the lazy dog. 1234567890
          </p>
        </div>

        <div className="p-4 border rounded">
          <h3 className="text-lg font-medium mb-2">Explicit font-sans class</h3>
          <p className="text-base font-sans">
            This text uses the font-sans class (Inter).
            The quick brown fox jumps over the lazy dog. 1234567890
          </p>
        </div>

        <div className="p-4 border rounded">
          <h3 className="text-lg font-medium mb-2">Inline CustomFont style</h3>
          <p className="text-base" style={{ fontFamily: '"CustomFont", "Inter", sans-serif' }}>
            This text uses inline CustomFont styling.
            The quick brown fox jumps over the lazy dog. 1234567890
          </p>
        </div>

        <div className="p-4 border rounded">
          <h3 className="text-lg font-medium mb-2">Weight variations</h3>
          <p className="text-base font-custom font-normal">Normal weight (400) - CustomFont Book</p>
          <p className="text-base font-custom font-medium">Medium weight (500) - CustomFont Medium</p>
          <p className="text-base font-custom font-semibold">Semibold weight (600) - should fallback</p>
          <p className="text-base font-custom font-bold">Bold weight (700) - should fallback</p>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="text-lg font-medium mb-2">Browser Font Info</h3>
        <p className="text-sm text-gray-600">
          Open browser dev tools and inspect the elements above to see:
          <br />• Computed font-family values
          <br />• Whether fonts are loading successfully
          <br />• Any font loading errors in Network tab
        </p>
      </div>
    </div>
  );
} 
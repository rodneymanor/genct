"use client";

import { useEffect, useState } from "react";

export default function FontTestPage() {
  const [fontStatus, setFontStatus] = useState<{
    customFontLoaded: boolean;
    spaceFontLoaded: boolean;
    interFontLoaded: boolean;
    errors: string[];
  }>({
    customFontLoaded: false,
    spaceFontLoaded: false,
    interFontLoaded: false,
    errors: [],
  });

  useEffect(() => {
    const checkFonts = async () => {
      const errors: string[] = [];
      
      try {
        // Check if FontFace API is supported
        if ('FontFace' in window) {
          // Force load CustomFont
          const customFontBook = new FontFace(
            'CustomFont',
            'url(/CustomFont-Book.54303b32.woff2) format("woff2"), url(/CustomFont-Book.d2378969.woff) format("woff")',
            { weight: '400' }
          );
          
          const customFontMedium = new FontFace(
            'CustomFont',
            'url(/CustomFont-Medium.0cc7d245.woff2) format("woff2"), url(/CustomFont-Medium.184a256f.woff) format("woff")',
            { weight: '500' }
          );

          try {
            await customFontBook.load();
            document.fonts.add(customFontBook);
            console.log('✅ CustomFont Book loaded successfully');
          } catch (e) {
            errors.push(`CustomFont Book failed: ${e}`);
            console.error('❌ CustomFont Book failed:', e);
          }

          try {
            await customFontMedium.load();
            document.fonts.add(customFontMedium);
            console.log('✅ CustomFont Medium loaded successfully');
          } catch (e) {
            errors.push(`CustomFont Medium failed: ${e}`);
            console.error('❌ CustomFont Medium failed:', e);
          }

          // Check if fonts are available
          const customFontAvailable = document.fonts.check('16px CustomFont');
          const spaceFontAvailable = document.fonts.check('16px "Space Grotesk"');
          const interFontAvailable = document.fonts.check('16px Inter');

          setFontStatus({
            customFontLoaded: customFontAvailable,
            spaceFontLoaded: spaceFontAvailable,
            interFontLoaded: interFontAvailable,
            errors,
          });

          console.log('Font Status:', {
            CustomFont: customFontAvailable,
            SpaceGrotesk: spaceFontAvailable,
            Inter: interFontAvailable,
          });
        } else {
          errors.push('FontFace API not supported');
        }
      } catch (e) {
        errors.push(`Font loading error: ${e}`);
        console.error('Font loading error:', e);
      }
    };

    checkFonts();
  }, []);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold mb-8">Font Loading Test</h1>
      
      {/* Font Status Dashboard */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Font Loading Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className={`p-3 rounded ${fontStatus.customFontLoaded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <strong>CustomFont:</strong> {fontStatus.customFontLoaded ? '✅ Loaded' : '❌ Not Loaded'}
          </div>
          <div className={`p-3 rounded ${fontStatus.spaceFontLoaded ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            <strong>Space Grotesk:</strong> {fontStatus.spaceFontLoaded ? '✅ Loaded' : '⚠️ Not Loaded'}
          </div>
          <div className={`p-3 rounded ${fontStatus.interFontLoaded ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            <strong>Inter:</strong> {fontStatus.interFontLoaded ? '✅ Loaded' : '⚠️ Not Loaded'}
          </div>
        </div>
        {fontStatus.errors.length > 0 && (
          <div className="p-3 bg-red-100 text-red-800 rounded">
            <strong>Errors:</strong>
            <ul className="list-disc list-inside mt-2">
              {fontStatus.errors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
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
          <h3 className="text-lg font-medium mb-2">Forced CustomFont with JavaScript</h3>
          <p 
            className="text-base" 
            style={{ 
              fontFamily: '"CustomFont", "Inter", sans-serif',
              fontDisplay: 'swap',
              fontWeight: 400
            }}
          >
            This text uses forced CustomFont with explicit styling.
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
          <br />• Check the Font Loading Status section above for real-time status
        </p>
      </div>
    </div>
  );
} 
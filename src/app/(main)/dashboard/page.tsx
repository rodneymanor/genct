export default function Page() {
  return (
    <div className="p-8 space-y-6">
      <div className="space-y-4">
        <h1 className="text-4xl font-normal">Dashboard - Inter Font</h1>
        <h2 className="text-3xl font-medium">Welcome to your dashboard</h2>
        <p className="text-lg font-normal">
          This page is using Inter font, which provides excellent readability and modern aesthetics.
          Inter is specifically designed for user interfaces.
        </p>
        <p className="text-base font-medium">
          This paragraph demonstrates the medium weight (500) of Inter font.
        </p>
        
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="text-xl font-medium mb-2">Font Information</h3>
          <p className="text-sm text-muted-foreground">
            Now using Inter font family with system font fallbacks for optimal performance and compatibility.
          </p>
        </div>
      </div>
    </div>
  );
}

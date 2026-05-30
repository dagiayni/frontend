export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light">
      <div className="text-center space-y-4">
        <h1 className="font-display text-4xl text-brand-dark font-bold">
          Restaurant ERP
        </h1>
        <p className="font-body text-gray-600 text-lg">
          POS · Kitchen Display · Inventory · Payments · Analytics
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <a
            href="/login"
            className="bg-brand text-white px-6 py-3 rounded-md font-body font-semibold
                       hover:bg-brand-hover transition-colors"
          >
            Staff Login
          </a>
        </div>
      </div>
    </div>
  );
}

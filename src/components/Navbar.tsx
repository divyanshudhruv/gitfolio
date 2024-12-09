
export function Navbar() {
  return (
    <nav className="bg-[#0d111700] fixed top-0 left-0 right-0 z-100" style={{marginBottom:'00px',position:'relative'}}>
      <div className="max-w-100vw mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center">
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-gray-300 hover:border-gray-600 border px-4 py-3 rounded-md border-gray-700 hover:border-gray-700"
          >
            <b>GitFolio</b>
          </a>
        </div>
      </div>
    </nav>
  );
}
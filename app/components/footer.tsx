export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] border-t border-[#2a2a2a] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} UAS CLIENT SITE BY BILLY TIMOTIUS C14220190. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="https://github.com/urosousetsu" className="text-gray-400 hover:text-gray-300 text-sm">
              Bill&rsquo; Github
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
// File: src/app/page.js
import { Button } from './components/Button';

export default function Home() {
  return (
    <div className="text-center space-y-6 py-12">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Welcome to University Marketplace
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Buy and sell items within your university community. Find textbooks, electronics, furniture, and more at great prices!
      </p>
      <div className="space-x-4">
        <Button variant="primary" href="/auth/launch">
          Get Started
        </Button>
        <Button variant="secondary" href="/browse">
          Start Browsing
        </Button>
      </div>
    </div>
  );
}

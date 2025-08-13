import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import Link from 'next/link';

export default function Success() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">Verification Successful!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your account has been verified. You're now ready to explore the University Marketplace!
        </p>
        <Button variant="primary" as="a" href="/browse" className="w-full">
          Start Browsing
        </Button>
      </Card>
    </div>
  );
}
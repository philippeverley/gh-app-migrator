
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RefreshCcw } from 'lucide-react';

interface CaptchaProps {
  onVerify: (token: string) => void;
}

const Captcha = ({ onVerify }: CaptchaProps) => {
  const [verified, setVerified] = useState(false);
  const [challenge, setChallenge] = useState<string>('');
  
  // Generate a simple math challenge
  const generateChallenge = () => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    setChallenge(`${num1} + ${num2}`);
    return num1 + num2;
  };
  
  const [answer, setAnswer] = useState<number | null>(null);
  const [userInput, setUserInput] = useState<string>('');
  
  useEffect(() => {
    const correctAnswer = generateChallenge();
    setAnswer(correctAnswer);
  }, []);
  
  const refreshChallenge = () => {
    const correctAnswer = generateChallenge();
    setAnswer(correctAnswer);
    setUserInput('');
    setVerified(false);
  };
  
  const checkAnswer = () => {
    const userAnswer = parseInt(userInput);
    if (!isNaN(userAnswer) && userAnswer === answer) {
      setVerified(true);
      // Generate a mock token - in a real implementation, this would be from reCAPTCHA or similar
      const mockToken = `captcha-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      onVerify(mockToken);
    } else {
      setVerified(false);
      refreshChallenge();
    }
  };
  
  return (
    <div className="border rounded-md p-4 bg-muted/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Verification Challenge</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={refreshChallenge}
          type="button"
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>
      
      {verified ? (
        <div className="flex items-center space-x-2">
          <Checkbox id="verified" checked={verified} />
          <label
            htmlFor="verified"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Verification successful
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm">
            Solve: <span className="font-medium">{challenge}</span>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Enter answer"
            />
            <Button type="button" onClick={checkAnswer}>Verify</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Captcha;

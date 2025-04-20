
"use client";

import {useEffect, useRef, useState} from 'react';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {generateTypingParagraph} from '@/ai/flows/generate-typing-paragraph';
import {useToast} from '@/hooks/use-toast';
import {Input} from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
interface TypingTestProps {}

const TypingTest: React.FC<TypingTestProps> = () => {
  const [paragraph, setParagraph] = useState<string>('');
  const [typedText, setTypedText] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [incorrectIndices, setIncorrectIndices] = useState<number[]>([]);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const inputRef = useRef<HTMLInputElement>(null);
  const {toast} = useToast();

  useEffect(() => {
    generateNewParagraph(difficulty);
  }, [difficulty]);

  useEffect(() => {
    if (startTime && endTime) {
      const timeInMinutes = (endTime - startTime) / 60000;
      const words = paragraph.split(' ').length;
      const calculatedWpm = Math.round(words / timeInMinutes);
      setWpm(calculatedWpm);

      const correctChars = paragraph.split('').filter((char, i) => char === typedText[i]).length;
      const calculatedAccuracy = Math.round((correctChars / paragraph.length) * 100);
      setAccuracy(calculatedAccuracy);
    }
  }, [endTime, startTime, paragraph, typedText]);

  const generateNewParagraph = async (difficulty: 'easy' | 'medium' | 'hard') => {
    try {
      const result = await generateTypingParagraph({difficulty: difficulty});
      setParagraph(result.paragraph);
      resetTest();
    } catch (error: any) {
      toast({
        title: 'Error generating paragraph',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!startTime) {
      setStartTime(Date.now());
    }

    const newTypedText = event.target.value;
    setTypedText(newTypedText);
    setIncorrectIndices(
      newTypedText.split('').reduce((acc: number[], char, i) => {
        if (char !== paragraph[i]) {
          acc.push(i);
        }
        return acc;
      }, [])
    );

    if (newTypedText.length === paragraph.length) {
      setEndTime(Date.now());
      inputRef?.current?.blur();
    } else {
      setEndTime(null);
      setWpm(0);
      setAccuracy(100);
    }
  };

  const resetTest = () => {
    setTypedText('');
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    setAccuracy(100);
    setIncorrectIndices([]);
    inputRef?.current?.focus();
  };

  const handleDifficultyChange = (value: 'easy' | 'medium' | 'hard') => {
    setDifficulty(value);
  };

  return (
    <Card className="w-[90%] max-w-3xl rounded-lg shadow-md p-4 md:p-6 space-y-4">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">AceType </CardTitle>
        <CardDescription className="text-center">
          Improve your typing speed and accuracy with our typing test!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Select value={difficulty} onValueChange={handleDifficultyChange} className="select">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent className="select">
              <SelectItem value="easy" className="select">Easy</SelectItem>
              <SelectItem value="medium" className="select">Medium</SelectItem>
              <SelectItem value="hard" className="select">Hard</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => generateNewParagraph(difficulty)} variant="outline" className="button">
            New Text
          </Button>
        </div>

        <div
          className="font-sans text-lg leading-relaxed break-words rounded-md px-4 py-2"
          style={{whiteSpace: 'pre-wrap'}}
        >
          {paragraph.split('').map((char, index) => {
            let charStyle = {};
            if (incorrectIndices.includes(index) && typedText[index] !== undefined) {
              charStyle = {color: 'hsl(var(--incorrect-input))'};
            } else {
              if (typedText[index] !== undefined) {
                charStyle = {color: 'hsl(var(--correct-input))'};
              }
            }
            return (
              <span key={index} style={charStyle} className={incorrectIndices.includes(index) && typedText[index] !== undefined ? 'incorrect' : typedText[index] !== undefined ? 'correct' : ''}>
                {char}
              </span>
            );
          })}
        </div>

        <Textarea
          ref={inputRef}
          placeholder="Start typing here..."
          value={typedText}
          onChange={handleTextChange}
          className="rounded-md px-4 py-2 text-lg textarea"
          autoFocus
        />

        <div className="flex items-center justify-between">
          <div className="text-lg">WPM: {wpm}</div>
          <div className="text-lg">Accuracy: {accuracy}%</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TypingTest;
